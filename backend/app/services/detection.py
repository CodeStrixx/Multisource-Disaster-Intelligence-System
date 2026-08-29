"""F4: Detection rules. Convert normalized signals into incident candidates.

Distinguishes OBSERVED_EVENT (something already happened) from FORECAST_RISK
(short-term inference from current conditions, per PRD Q4).
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import timedelta
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..config import settings
from ..models import EarthquakeEvent, WeatherObservation, utcnow
from ..utils import ensure_utc, haversine_km
from . import risk as risk_svc


@dataclass
class Candidate:
    disaster_type: str
    signal_kind: str  # OBSERVED_EVENT | FORECAST_RISK
    latitude: float
    longitude: float
    location_name: str
    title: str
    summary: str
    risk: risk_svc.RiskOutcome
    evidence: list[dict[str, Any]] = field(default_factory=list)
    rainfall_mm: float | None = None
    temperature_c: float | None = None
    magnitude: float | None = None


def detect_from_weather(db: Session) -> list[Candidate]:
    """Latest observation per monitored point; apply rain/heat/cyclone rules."""
    candidates: list[Candidate] = []
    seen_points: set[tuple[float, float]] = set()

    observations = db.scalars(
        select(WeatherObservation).order_by(WeatherObservation.observed_at.desc()).limit(400)
    ).all()

    for obs in observations:
        key = (round(obs.latitude, 3), round(obs.longitude, 3))
        if key in seen_points:
            continue
        seen_points.add(key)

        age_h = abs((utcnow() - ensure_utc(obs.observed_at)).total_seconds()) / 3600.0
        if age_h > settings.STALE_WEATHER_HOURS * 3:
            continue  # too stale to drive detection

        rain = obs.rainfall_mm_24h or 0.0
        warning = obs.warning_level or "none"

        # Rule 1: heavy rain + official warning + same region => flood-risk incident
        if rain >= settings.RAIN_HEAVY_MM_24H and rain < settings.RAIN_VERY_HEAVY_MM_24H:
            rc = risk_svc.classify_rain(rain, warning, obs.wind_kmh)
            candidates.append(Candidate(
                disaster_type="heavy_rain",
                signal_kind="OBSERVED_EVENT",
                latitude=obs.latitude,
                longitude=obs.longitude,
                location_name=obs.location_name,
                title=f"Heavy Rainfall Over {obs.location_name}",
                summary=(
                    f"{rain:.0f} mm of rainfall recorded in the last 24 hours around "
                    f"{obs.location_name}. Conditions ({obs.condition}) with {warning} level advisory."
                ),
                risk=rc,
                evidence=[_wx_evidence(obs)],
                rainfall_mm=rain,
                temperature_c=obs.temperature_c,
            ))

        # Rule 2: very heavy/extreme rainfall OR warning-level => flood risk forecast
        if rain >= settings.RAIN_VERY_HEAVY_MM_24H or (warning == "warning" and rain >= 20):
            rc = risk_svc.classify_rain(rain, warning, obs.wind_kmh)
            kind = "FORECAST_RISK" if warning != "warning" else "OBSERVED_EVENT"
            candidates.append(Candidate(
                disaster_type="flood",
                signal_kind=kind,
                latitude=obs.latitude,
                longitude=obs.longitude,
                location_name=obs.location_name,
                title=f"Flood Risk Detected Near {obs.location_name}",
                summary=(
                    f"Rainfall exceeds threshold ({rain:.0f} mm/24h) with official warning active in "
                    f"{obs.location_name}. Waterlogging and flash-flood risk likely in low-lying areas."
                ),
                risk=rc,
                evidence=[_wx_evidence(obs)],
                rainfall_mm=rain,
                temperature_c=obs.temperature_c,
            ))

        # Rule 3: destructive winds => cyclone risk (coastal proxy)
        if (obs.wind_kmh or 0) >= settings.CYCLONE_WIND_KMH:
            rc = risk_svc.classify_cyclone(obs.wind_kmh, warning)
            candidates.append(Candidate(
                disaster_type="cyclone",
                signal_kind="OBSERVED_EVENT",
                latitude=obs.latitude,
                longitude=obs.longitude,
                location_name=obs.location_name,
                title=f"Severe Wind Alert Around {obs.location_name}",
                summary=(
                    f"Sustained winds of {obs.wind_kmh:.0f} km/h observed near {obs.location_name}. "
                    "Structural damage and coastal surge possible."
                ),
                risk=rc,
                evidence=[_wx_evidence(obs)],
                rainfall_mm=rain,
                temperature_c=obs.temperature_c,
            ))

        # Rule 4: heatwave
        if (obs.temperature_c or 0) >= settings.HEATWAVE_TEMP_C:
            rc = risk_svc.classify_heat(obs.temperature_c)
            candidates.append(Candidate(
                disaster_type="heatwave",
                signal_kind="OBSERVED_EVENT",
                latitude=obs.latitude,
                longitude=obs.longitude,
                location_name=obs.location_name,
                title=f"Heatwave Conditions In {obs.location_name}",
                summary=(
                    f"Maximum temperatures near {obs.temperature_c:.1f}°C recorded at "
                    f"{obs.location_name}. Heat-stress risk for vulnerable groups."
                ),
                risk=rc,
                evidence=[_wx_evidence(obs)],
                temperature_c=obs.temperature_c,
            ))

    return candidates


def detect_from_earthquakes(db: Session) -> list[Candidate]:
    """Record all events; create public candidates above configurable threshold."""
    since = utcnow() - timedelta(hours=24)
    quakes = db.scalars(
        select(EarthquakeEvent).where(EarthquakeEvent.occurred_at >= since).order_by(EarthquakeEvent.occurred_at.desc())
    ).all()
    candidates: list[Candidate] = []
    for q in quakes:
        if q.magnitude < settings.QUAKE_PUBLIC_THRESHOLD:
            continue
        rc = risk_svc.classify_quake(q.magnitude, q.depth_km)
        candidates.append(Candidate(
            disaster_type="earthquake",
            signal_kind="OBSERVED_EVENT",
            latitude=q.latitude,
            longitude=q.longitude,
            location_name=q.region_name,
            title=f"Magnitude {q.magnitude:.1f} Earthquake — {q.region_name}",
            summary=(
                f"An M{q.magnitude:.1f} earthquake occurred near {q.region_name}"
                + (f" at depth {q.depth_km:.0f} km." if q.depth_km else ".")
            ),
            risk=rc,
            magnitude=q.magnitude,
            evidence=[{
                "evidence_type": "provider_event",
                "source_provider_id": "usgs_earthquake",
                "reference_id": q.external_event_id,
                "detail": f"USGS M{q.magnitude:.1f} @ ({q.latitude:.2f}, {q.longitude:.2f}) depth {q.depth_km}km",
                "confidence_weight": min(60.0, 20.0 + q.magnitude * 6),
            }],
        ))
    return candidates


def detect_from_forecasts(db: Session) -> list[Candidate]:
    """Early-warning rules over the NEXT 24h forecast window.

    Uses the forecast aggregates stored with each latest observation to raise
    FORECAST_RISK candidates before anything is observed on the ground.
    """
    candidates: list[Candidate] = []
    seen_points: set[tuple[float, float]] = set()

    observations = db.scalars(
        select(WeatherObservation).order_by(WeatherObservation.observed_at.desc()).limit(400)
    ).all()

    for obs in observations:
        key = (round(obs.latitude, 3), round(obs.longitude, 3))
        if key in seen_points:
            continue
        seen_points.add(key)

        fc_rain = obs.rainfall_mm_fc24h or 0.0
        fc_wind = obs.wind_kmh_fc24h_max or 0.0
        fc_temp = obs.temp_c_fc24h_max or 0.0
        horizon_note = "next 24 hours"

        # Rule F1: forecast extreme rainfall -> predicted flood risk
        if fc_rain >= settings.RAIN_VERY_HEAVY_MM_24H:
            rc = risk_svc.classify_rain(fc_rain, "watch" if fc_rain < settings.RAIN_EXTREME_MM_24H else "warning")
            candidates.append(Candidate(
                disaster_type="flood",
                signal_kind="FORECAST_RISK",
                latitude=obs.latitude,
                longitude=obs.longitude,
                location_name=obs.location_name,
                title=f"Flood Risk Expected Near {obs.location_name} ({horizon_note})",
                summary=(
                    f"Weather models forecast {fc_rain:.0f} mm of rainfall around {obs.location_name} within the "
                    f"{horizon_note}. Waterlogging and flash-flood conditions likely in low-lying areas; "
                    "take precautionary measures ahead of the rainfall."
                ),
                risk=rc,
                evidence=[_wx_forecast_evidence(obs, f"forecast 24h rainfall {fc_rain:.0f} mm")],
                rainfall_mm=fc_rain,
                temperature_c=obs.temperature_c,
            ))

        # Rule F2: forecast heavy rain band -> predicted heavy-rain incident
        elif settings.RAIN_HEAVY_MM_24H <= fc_rain < settings.RAIN_VERY_HEAVY_MM_24H:
            rc = risk_svc.classify_rain(fc_rain, "alert")
            candidates.append(Candidate(
                disaster_type="heavy_rain",
                signal_kind="FORECAST_RISK",
                latitude=obs.latitude,
                longitude=obs.longitude,
                location_name=obs.location_name,
                title=f"Heavy Rainfall Predicted Over {obs.location_name} ({horizon_note})",
                summary=(
                    f"Forecasts indicate {fc_rain:.0f} mm of rain around {obs.location_name} in the "
                    f"{horizon_note}. Expect waterlogging and traffic disruption."
                ),
                risk=rc,
                evidence=[_wx_forecast_evidence(obs, f"forecast 24h rainfall {fc_rain:.0f} mm")],
                rainfall_mm=fc_rain,
                temperature_c=obs.temperature_c,
            ))

        # Rule F3: forecast destructive winds -> predicted cyclone risk
        if fc_wind >= settings.CYCLONE_WIND_KMH:
            rc = risk_svc.classify_cyclone(fc_wind, "watch")
            candidates.append(Candidate(
                disaster_type="cyclone",
                signal_kind="FORECAST_RISK",
                latitude=obs.latitude,
                longitude=obs.longitude,
                location_name=obs.location_name,
                title=f"Cyclonic Winds Forecast Near {obs.location_name} ({horizon_note})",
                summary=(
                    f"Sustained winds up to {fc_wind:.0f} km/h are forecast near {obs.location_name} within the "
                    f"{horizon_note}. Secure loose structures and follow official cyclone advisories."
                ),
                risk=rc,
                evidence=[_wx_forecast_evidence(obs, f"forecast max wind {fc_wind:.0f} km/h")],
                rainfall_mm=fc_rain,
                temperature_c=obs.temperature_c,
            ))

        # Rule F4: forecast heatwave temperatures
        if fc_temp >= settings.HEATWAVE_TEMP_C + 1.5:
            rc = risk_svc.classify_heat(fc_temp)
            candidates.append(Candidate(
                disaster_type="heatwave",
                signal_kind="FORECAST_RISK",
                latitude=obs.latitude,
                longitude=obs.longitude,
                location_name=obs.location_name,
                title=f"Heatwave Conditions Predicted In {obs.location_name} ({horizon_note})",
                summary=(
                    f"Daytime temperatures up to {fc_temp:.1f}°C are forecast at {obs.location_name} within the "
                    f"{horizon_note}. Heat-stress precautions advised for vulnerable groups."
                ),
                risk=rc,
                evidence=[_wx_forecast_evidence(obs, f"forecast max temperature {fc_temp:.1f}°C")],
                temperature_c=fc_temp,
            ))

    return candidates


def _wx_evidence(obs: WeatherObservation) -> dict[str, Any]:
    return {
        "evidence_type": "provider_observation",
        "source_provider_id": "open_meteo",
        "reference_id": f"wx-{obs.id}",
        "detail": (
            f"{obs.condition}, 24h rainfall {obs.rainfall_mm_24h or 0:.0f}mm, "
            f"temp {obs.temperature_c or '—'}°C, warning={obs.warning_level}"
        ),
        "confidence_weight": 25.0,
    }


def _wx_forecast_evidence(obs: WeatherObservation, detail: str) -> dict[str, Any]:
    return {
        "evidence_type": "provider_forecast",
        "source_provider_id": "open_meteo",
        "reference_id": f"wxfc-{obs.id}",
        "detail": f"Open-Meteo model {detail} (24h horizon)",
        # forecasts carry slightly lower confidence than direct observations
        "confidence_weight": 18.0,
    }


def cluster_candidates(candidates: list[Candidate]) -> list[Candidate]:
    """Signals within CLUSTER_RADIUS_KM merge into one candidate.

    Grouping key is (disaster_type, signal_kind) so a predicted incident stays
    distinct from an already-observed one (PRD F4 requires the distinction).
    """
    clustered: list[Candidate] = []
    for cand in sorted(candidates, key=lambda c: -c.risk.risk_score):
        merged_into = None
        for existing in clustered:
            if (
                existing.disaster_type == cand.disaster_type
                and existing.signal_kind == cand.signal_kind
                and haversine_km(existing.latitude, existing.longitude, cand.latitude, cand.longitude)
                <= settings.CLUSTER_RADIUS_KM
            ):
                merged_into = existing
                break
        if merged_into:
            merged_into.evidence.extend(cand.evidence)
            # strongest signal defines headline numbers
            if cand.risk.risk_score > merged_into.risk.risk_score:
                merged_into.risk = cand.risk
            merged_into.rainfall_mm = max(merged_into.rainfall_mm or 0, cand.rainfall_mm or 0) or merged_into.rainfall_mm
            merged_into.magnitude = max(merged_into.magnitude or 0, cand.magnitude or 0) or merged_into.magnitude
            merged_into.temperature_c = max(merged_into.temperature_c or 0, cand.temperature_c or 0) or merged_into.temperature_c
        else:
            clustered.append(cand)
    return clustered


__all__ = [
    "Candidate",
    "detect_from_weather",
    "detect_from_earthquakes",
    "detect_from_forecasts",
    "cluster_candidates",
]
