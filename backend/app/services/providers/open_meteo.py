"""Open-Meteo adapter (free, no API key) for weather + rainfall ingestion (F2)."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

import httpx

from ...config import settings
from .base import BaseProvider

# WMO weather interpretation codes -> human condition
WMO_CONDITIONS = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Depositing rime fog",
    51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
    56: "Light freezing drizzle", 57: "Dense freezing drizzle",
    61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
    66: "Light freezing rain", 67: "Heavy freezing rain",
    71: "Slight snowfall", 73: "Moderate snowfall", 75: "Heavy snowfall",
    77: "Snow grains", 80: "Slight rain showers", 81: "Moderate rain showers",
    82: "Violent rain showers", 85: "Slight snow showers", 86: "Heavy snow showers",
    95: "Thunderstorm", 96: "Thunderstorm with slight hail", 99: "Thunderstorm with heavy hail",
}


def _warning_level(rain_1h_mm: float | None, rain_24h_mm: float | None, code: int) -> str:
    """Derive a simple warning level from observed intensity (IMD-inspired)."""
    if code >= 95 or (rain_1h_mm is not None and rain_1h_mm >= 30):
        return "warning"
    if (rain_24h_mm is not None and rain_24h_mm >= settings.RAIN_VERY_HEAVY_MM_24H) or (
        rain_1h_mm is not None and rain_1h_mm >= 15
    ):
        return "watch"
    if (rain_24h_mm is not None and rain_24h_mm >= settings.RAIN_HEAVY_MM_24H) or (
        rain_1h_mm is not None and rain_1h_mm >= 7.5
    ):
        return "alert"
    return "none"


class OpenMeteoProvider(BaseProvider):
    provider_id = "open_meteo"

    def __init__(self, monitor_points: list[dict[str, Any]] | None = None):
        # monitor_points: [{name,district,state,latitude,longitude}, ...]
        self.monitor_points = monitor_points or []

    def fetch_data(self) -> list[dict[str, Any]]:
        results: list[dict[str, Any]] = []
        with httpx.Client(timeout=settings.HTTP_TIMEOUT_SECONDS) as client:
            for point in self.monitor_points:
                params = {
                    "latitude": point["latitude"],
                    "longitude": point["longitude"],
                    "current": "temperature_2m,precipitation,weather_code,wind_speed_10m",
                    "hourly": "precipitation,wind_speed_10m,temperature_2m",
                    "past_days": 2,
                    "forecast_days": 3,
                    "timezone": "UTC",
                }
                resp = client.get(settings.OPEN_METEO_URL, params=params)
                resp.raise_for_status()
                payload = dict(resp.json())
                payload["_monitor_point"] = point
                results.append(payload)
                # Be gentle with the free tier when many points are monitored.
                if len(self.monitor_points) > 1:
                    import time

                    time.sleep(0.4)
        return results

    @staticmethod
    def _forecast_aggregates(times: list[str], series: dict[str, list], now: datetime) -> dict[str, float | None]:
        """Sum/max of hourly series over the NEXT 24h (the prediction horizon)."""
        from ...utils import parse_iso_utc

        horizon_end = now + timedelta(hours=24)
        rain_total = 0.0
        wind_max: float | None = None
        temp_max: float | None = None
        any_rain_ts = False
        for i, ts_str in enumerate(times):
            ts = parse_iso_utc(ts_str)
            if ts is None or not (now <= ts <= horizon_end):
                continue
            rains = series.get("precipitation") or []
            winds = series.get("wind_speed_10m") or []
            temps = series.get("temperature_2m") or []
            if i < len(rains) and rains[i] is not None:
                rain_total += float(rains[i])
                any_rain_ts = True
            if i < len(winds) and winds[i] is not None:
                w = float(winds[i])
                wind_max = w if wind_max is None else max(wind_max, w)
            if i < len(temps) and temps[i] is not None:
                t = float(temps[i])
                temp_max = t if temp_max is None else max(temp_max, t)
        return {
            "rain_24h": round(rain_total, 2) if any_rain_ts else None,
            "wind_max": wind_max,
            "temp_max": temp_max,
        }

    def normalize_data(self, raw: list[dict[str, Any]]) -> list[dict[str, Any]]:
        normalized: list[dict[str, Any]] = []
        for payload in raw:
            point = payload.get("_monitor_point", {})
            current = payload.get("current") or {}
            hourly = payload.get("hourly") or {}
            times: list[str] = hourly.get("time", []) or []
            series = {
                "precipitation": hourly.get("precipitation", []) or [],
                "wind_speed_10m": hourly.get("wind_speed_10m", []) or [],
                "temperature_2m": hourly.get("temperature_2m", []) or [],
            }

            now = datetime.now(timezone.utc)
            window_start = now - timedelta(hours=24)
            rain_24h = 0.0
            from ...utils import parse_iso_utc

            for ts_str, mm in zip(times, series["precipitation"]):
                ts = parse_iso_utc(ts_str)
                if ts is None:
                    continue
                if window_start <= ts <= now and mm:
                    rain_24h += float(mm)

            # Mock payloads carry pre-computed forecast aggregates (no hourly series).
            fc = payload.get("_mock_forecast") or self._forecast_aggregates(times, series, now)

            code = int(current.get("weather_code") or 0)
            rain_1h = current.get("precipitation")
            obs_time = parse_iso_utc(current.get("time")) or now
            item = {
                "provider_id": self.provider_id,
                "location_name": f"{point.get('name', 'Unknown')}",
                "district": point.get("district", ""),
                "state": point.get("state", ""),
                "latitude": float(point["latitude"]),
                "longitude": float(point["longitude"]),
                "timestamp": now.isoformat(),
                "temperature": current.get("temperature_2m"),
                "rainfall_mm_1h": float(rain_1h) if rain_1h is not None else None,
                "rainfall_mm_24h": round(rain_24h, 2),
                "rainfall_mm_fc24h": fc["rain_24h"],
                "wind_kmh_fc24h_max": fc["wind_max"],
                "temp_c_fc24h_max": fc["temp_max"],
                "wind_kmh": current.get("wind_speed_10m"),
                "weather_condition": WMO_CONDITIONS.get(code, "Unknown"),
                "weather_code": code,
                "warning_level": _warning_level(
                    float(rain_1h) if rain_1h is not None else None,
                    rain_24h,
                    code,
                ),
                "observed_at": obs_time.isoformat(),
                "source_timestamp": obs_time.isoformat(),
                "external_id": f"openmeteo-{point.get('name', 'x')}-{now.strftime('%Y%m%dT%H%M')}",
            }
            normalized.append(item)
        return normalized


class MockWeatherProvider(OpenMeteoProvider):
    """Deterministic demo fallback used when the live provider fails (EC1/M8)."""

    provider_id = "open_meteo"

    DEMO_SCENARIOS = {
        # name -> (rain_24h, temp, wind, warning)
        "Ahmedabad": (185.0, 27.5, 22.0, "watch"),
        "Wayanad": (240.0, 21.0, 18.0, "warning"),
        "Mumbai": (110.0, 28.0, 31.0, "alert"),
        "Chennai": (130.0, 29.0, 74.0, "warning"),
        "New Delhi": (35.0, 33.0, 14.0, "none"),
        "Guwahati": (210.0, 27.0, 26.0, "warning"),
        "Puri / Bhubaneswar": (195.0, 28.0, 88.0, "warning"),
        "Joshimath": (160.0, 16.0, 34.0, "warning"),
        "Kolkata / Sundarbans": (125.0, 29.5, 40.0, "watch"),
        "Shimla / Mandi": (175.0, 17.0, 36.0, "warning"),
        "Patna": (90.0, 30.0, 20.0, "alert"),
        "Hyderabad": (12.0, 31.0, 12.0, "none"),
        "Bengaluru": (6.0, 26.0, 11.0, "none"),
        "Jaipur": (0.4, 43.5, 16.0, "none"),
        "Srinagar": (2.0, 19.0, 9.0, "none"),
        "Port Blair": (25.0, 29.0, 24.0, "none"),
        "Visakhapatnam": (18.0, 30.0, 19.0, "none"),
    }

    def fetch_data(self) -> list[dict[str, Any]]:
        now = datetime.now(timezone.utc)
        items = []
        for p in self.monitor_points:
            rain, temp, wind, warn = self.DEMO_SCENARIOS.get(
                p.get("name", ""), (8.0, 29.0, 12.0, "none")
            )
            code = 65 if rain > 60 else (61 if rain > 2 else 0)
            items.append({
                "_monitor_point": p,
                "current": {
                    "temperature_2m": temp,
                    "precipitation": round(rain / 24.0, 2),
                    "weather_code": code,
                    "wind_speed_10m": wind,
                    "time": now.isoformat(),
                },
                "hourly": {"time": [], "precipitation": []},
                "_mock_forecast": {
                    "rain_24h": round(rain * 1.15, 2),
                    "wind_max": round(wind * 1.25, 1),
                    "temp_max": round(temp + 1.5, 1),
                },
            })
        return items
