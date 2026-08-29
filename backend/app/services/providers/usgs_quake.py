"""USGS FDSN earthquake adapter (free, no API key) for F3."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

import httpx

from ...config import settings
from .base import BaseProvider


class UsgsEarthquakeProvider(BaseProvider):
    provider_id = "usgs_earthquake"
    LOOKBACK_HOURS = 48
    MIN_MAG_FETCH = 2.5  # fetch slightly below public threshold for completeness

    def fetch_data(self) -> list[dict[str, Any]]:
        start = datetime.now(timezone.utc) - timedelta(hours=self.LOOKBACK_HOURS)
        bbox = settings.INDIA_BBOX
        params = {
            "format": "geojson",
            "starttime": start.strftime("%Y-%m-%dT%H:%M:%S"),
            "minlatitude": bbox["minlat"],
            "maxlatitude": bbox["maxlat"],
            "minlongitude": bbox["minlon"],
            "maxlongitude": bbox["maxlon"],
            "minmagnitude": self.MIN_MAG_FETCH,
            "orderby": "time",
        }
        with httpx.Client(timeout=settings.HTTP_TIMEOUT_SECONDS) as client:
            resp = client.get(settings.USGS_QUAKE_URL, params=params)
            resp.raise_for_status()
            return [resp.json()]

    def normalize_data(self, raw: list[dict[str, Any]]) -> list[dict[str, Any]]:
        out: list[dict[str, Any]] = []
        for feed in raw:
            for feature in (feed.get("features") or []):
                props = feature.get("properties") or {}
                geom = feature.get("geometry") or {}
                coords = geom.get("coordinates") or [None, None, None]
                lon, lat, depth = coords[0], coords[1], coords[2]
                mag = props.get("mag")
                occurred_ms = props.get("time")
                if mag is None or occurred_ms is None:
                    continue
                occurred = datetime.fromtimestamp(occurred_ms / 1000.0, tz=timezone.utc)
                place = props.get("place") or "Unknown region"
                out.append({
                    "provider_id": self.provider_id,
                    "external_event_id": str(feature.get("id") or f"usgs-{occurred_ms}-{lat}-{lon}"),
                    "magnitude": float(mag),
                    "latitude": float(lat),
                    "longitude": float(lon),
                    "depth_km": float(depth) if depth is not None else None,
                    "region_name": place,
                    "occurred_at": occurred.isoformat(),
                    "source_timestamp": occurred.isoformat(),
                })
        return out


class MockEarthquakeProvider(UsgsEarthquakeProvider):
    """Demo fallback: replays a plausible Andaman-sea style event (EC1)."""

    provider_id = "usgs_earthquake"

    def fetch_data(self) -> list[dict[str, Any]]:
        occurred = datetime.now(timezone.utc) - timedelta(minutes=37)
        return [{
            "features": [{
                "id": "MOCK-QUAKE-0001",
                "properties": {
                    "mag": 4.6,
                    "place": "Andaman Sea, India region",
                    "time": int(occurred.timestamp() * 1000),
                },
                "geometry": {"coordinates": [92.9, 11.9, 18.0]},
            }]
        }]
