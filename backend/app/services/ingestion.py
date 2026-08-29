"""Ingestion orchestration: providers -> normalize -> persist (F1/F2/F3) with failure isolation."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..config import settings
from ..models import DataSource, EarthquakeEvent, RawDataRecord, WeatherObservation, utcnow
from ..utils import ensure_utc, haversine_km, parse_iso_utc
from .providers.base import BaseProvider
from .providers.open_meteo import MockWeatherProvider, OpenMeteoProvider
from .providers.usgs_quake import MockEarthquakeProvider, UsgsEarthquakeProvider


def _monitor_points(db: Session) -> list[dict[str, Any]]:
    """Curated free monitoring points (mirrors the frontend's saved locations)."""
    from ..seed import MONITOR_LOCATIONS

    return [
        {
            "name": loc["name"],
            "district": loc["district"],
            "state": loc["state"],
            "latitude": loc["lat"],
            "longitude": loc["lng"],
        }
        for loc in MONITOR_LOCATIONS
    ]


def _get_or_create_source(db: Session, provider_id: str, name: str, url: str, stype: str) -> DataSource:
    src = db.scalar(select(DataSource).where(DataSource.provider_id == provider_id))
    if not src:
        src = DataSource(provider_id=provider_id, name=name, source_url=url, type=stype)
        db.add(src)
        db.flush()
    return src


def ingest_weather(db: Session) -> dict[str, Any]:
    points = _monitor_points(db)
    live = OpenMeteoProvider(points)
    result = live.collect()

    used_mock = False
    if (not result.ok or not result.items) and settings.MOCK_FALLBACK:
        result = MockWeatherProvider(points).collect()
        used_mock = True

    stored = 0
    src = _get_or_create_source(
        db,
        "open_meteo",
        "Open-Meteo Weather & Rainfall",
        settings.OPEN_METEO_URL,
        "trusted",
    )
    now = datetime.now(timezone.utc)
    for item in result.items:
        obs = WeatherObservation(
            source_id=src.id,
            location_name=item.get("location_name", ""),
            latitude=item["latitude"],
            longitude=item["longitude"],
            temperature_c=item.get("temperature"),
            rainfall_mm_1h=item.get("rainfall_mm_1h"),
            rainfall_mm_24h=item.get("rainfall_mm_24h"),
            rainfall_mm_fc24h=item.get("rainfall_mm_fc24h"),
            wind_kmh_fc24h_max=item.get("wind_kmh_fc24h_max"),
            temp_c_fc24h_max=item.get("temp_c_fc24h_max"),
            wind_kmh=item.get("wind_kmh"),
            condition=item.get("weather_condition", "unknown"),
            warning_level=item.get("warning_level", "none"),
            observed_at=parse_iso_utc(item.get("observed_at")) or now,
            created_at=now,
        )
        db.add(obs)
        db.add(RawDataRecord(
            source_id=src.id,
            external_id=item.get("external_id", f"wx-{now.timestamp()}"),
            raw_payload_reference=f"weather:{item['latitude']},{item['longitude']}",
            source_timestamp=now,
            processing_status="processed",
        ))
        stored += 1

    src.last_success_at = now if result.ok else src.last_success_at
    src.last_failure_at = None if result.ok else now
    src.last_error = None if result.ok else (result.error or "no data")
    src.status = "active" if result.ok else "stale"

    db.commit()
    from ..state import mark_failure as _pf, mark_success as _ps

    if result.ok:
        _ps(src.provider_id, used_mock=used_mock)
    else:
        _pf(src.provider_id, result.error or "ingestion failed")
    return {"provider": src.provider_id, "ok": result.ok, "stored": stored, "mock": used_mock}


def ingest_earthquakes(db: Session) -> dict[str, Any]:
    """Store quake events with dedupe by external id OR time+location+magnitude similarity (EC2)."""
    live = UsgsEarthquakeProvider()
    result = live.collect()

    used_mock = False
    if (not result.ok or not result.items) and settings.MOCK_FALLBACK:
        result = MockEarthquakeProvider().collect()
        used_mock = True

    src = _get_or_create_source(
        db,
        "usgs_earthquake",
        "USGS Earthquake Hazards Program",
        settings.USGS_QUAKE_URL,
        "official",
    )
    stored, skipped = 0, 0
    recent = db.scalars(
        select(EarthquakeEvent).where(
            EarthquakeEvent.occurred_at >= datetime.now(timezone.utc) - timedelta(days=3)
        )
    ).all()
    # (magnitude, lat, lng, occurred_at) tuples for same-batch dedupe checks
    recent_quakes: list[tuple[float, float, float, datetime]] = [
        (float(r.magnitude), r.latitude, r.longitude, ensure_utc(r.occurred_at))  # type: ignore[misc]
        for r in recent
    ]
    now = datetime.now(timezone.utc)
    for q in result.items:
        ext_id = str(q["external_event_id"])
        dup_ext = db.scalar(select(EarthquakeEvent).where(EarthquakeEvent.external_event_id == ext_id))
        if dup_ext:
            skipped += 1
            continue
        q_occurred = parse_iso_utc(q["occurred_at"])
        fuzzy_dup = any(
            abs(m - float(q["magnitude"])) <= 0.35
            and haversine_km(la, lo, q["latitude"], q["longitude"]) <= 40
            and abs((oc - q_occurred).total_seconds()) < 300
            for m, la, lo, oc in recent_quakes
        )
        if fuzzy_dup:
            skipped += 1
            continue
        occurred = datetime.fromisoformat(q["occurred_at"])
        db.add(EarthquakeEvent(
            source_id=src.id,
            external_event_id=ext_id,
            magnitude=float(q["magnitude"]),
            latitude=q["latitude"],
            longitude=q["longitude"],
            depth_km=q.get("depth_km"),
            region_name=q.get("region_name", ""),
            occurred_at=occurred,
            created_at=now,
        ))
        # guard against duplicates within the same provider batch (tuples, not ORM rows)
        recent_quakes.append((float(q["magnitude"]), q["latitude"], q["longitude"], ensure_utc(occurred)))  # type: ignore[arg-type]
        stored += 1
        db.add(RawDataRecord(
            source_id=src.id,
            external_id=ext_id,
            raw_payload_reference=f"quake:{ext_id}",
            source_timestamp=occurred,
            processing_status="processed",
        ))

    src.last_success_at = now if result.ok else src.last_success_at
    src.last_failure_at = None if result.ok else now
    src.last_error = None if result.ok else (result.error or "no data")
    src.status = "active" if result.ok else "stale"
    db.commit()

    from ..state import mark_failure as _pf, mark_success as _ps

    if result.ok:
        _ps(src.provider_id, used_mock=used_mock)
    else:
        _pf(src.provider_id, result.error or "ingestion failed")
    return {"provider": src.provider_id, "ok": result.ok, "stored": stored, "skipped_duplicates": skipped}


def latest_weather_for_point(db: Session, lat: float, lng: float, max_km: float | None = None):
    """Newest observation within max_km of a point; returns (observation, is_stale)."""
    max_km = max_km or max(60.0, settings.CLUSTER_RADIUS_KM)
    row = db.scalars(
        select(WeatherObservation).order_by(WeatherObservation.observed_at.desc()).limit(200)
    ).all()
    best = None
    for o in row:
        if haversine_km(lat, lng, o.latitude, o.longitude) <= max_km:
            best = o
            break
    stale = False
    if best:
        age_h = (utcnow() - ensure_utc(best.observed_at)).total_seconds() / 3600.0
        stale = age_h > settings.STALE_WEATHER_HOURS
    return best, stale


__all__ = [
    "BaseProvider",
    "ingest_weather",
    "ingest_earthquakes",
    "latest_weather_for_point",
]
