"""Application configuration (env-driven, free-tier friendly)."""
from __future__ import annotations

import os
from functools import lru_cache

from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))


def _bool(key: str, default: bool) -> bool:
    return os.getenv(key, str(default)).strip().lower() in ("1", "true", "yes", "on")


def _float(key: str, default: float) -> float:
    try:
        return float(os.getenv(key, default))
    except (TypeError, ValueError):
        return default


class Settings:
    """All runtime settings. Every detection threshold is config-driven."""

    APP_NAME: str = "Disaster Intelligence Backend"
    API_V1_PREFIX: str = "/api/v1"

    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./disaster.db")

    ALLOWED_ORIGINS: list[str] = [
        o.strip()
        for o in os.getenv(
            "ALLOWED_ORIGINS",
            "http://localhost:3000,http://127.0.0.1:3000",
        ).split(",")
        if o.strip()
    ]

    ADMIN_SECRET: str = os.getenv("ADMIN_SECRET", "sih-demo-admin-secret")

    ENABLE_SCHEDULER: bool = _bool("ENABLE_SCHEDULER", True)
    MOCK_FALLBACK: bool = _bool("MOCK_FALLBACK", False)

    WEATHER_REFRESH_MINUTES: int = int(os.getenv("WEATHER_REFRESH_MINUTES", 10))
    EARTHQUAKE_REFRESH_MINUTES: int = int(os.getenv("EARTHQUAKE_REFRESH_MINUTES", 10))
    DETECTION_INTERVAL_MINUTES: int = int(os.getenv("DETECTION_INTERVAL_MINUTES", 5))

    # ---- Detection / risk rule thresholds ----
    QUAKE_PUBLIC_THRESHOLD: float = _float("QUAKE_PUBLIC_THRESHOLD", 3.0)
    RAIN_HEAVY_MM_24H: float = _float("RAIN_HEAVY_MM_24H", 64.5)       # IMD heavy rain
    RAIN_VERY_HEAVY_MM_24H: float = _float("RAIN_VERY_HEAVY_MM_24H", 115.6)
    RAIN_EXTREME_MM_24H: float = _float("RAIN_EXTREME_MM_24H", 204.5)  # IMD extremely heavy
    HEATWAVE_TEMP_C: float = _float("HEATWAVE_TEMP_C", 40.0)
    CYCLONE_WIND_KMH: float = _float("CYCLONE_WIND_KMH", 62.0)

    CLUSTER_RADIUS_KM: float = _float("CLUSTER_RADIUS_KM", 50.0)
    STALE_WEATHER_HOURS: float = _float("STALE_WEATHER_HOURS", 2.0)

    # Community verification: citizen reports reaching this many upvotes are
    # automatically promoted to VERIFIED (F12 crowd-trust rule).
    REPORT_VERIFY_UPVOTES: int = int(os.getenv("REPORT_VERIFY_UPVOTES", 10))

    # Incident expiry hours per disaster type (EC6)
    INCIDENT_EXPIRY_HOURS: dict[str, int] = {
        "flood": 48,
        "heavy_rain": 24,
        "cyclone": 72,
        "landslide": 72,
        "earthquake": 24,
        "heatwave": 96,
    }

    HTTP_TIMEOUT_SECONDS: float = 12.0

    OPEN_METEO_URL: str = "https://api.open-meteo.com/v1/forecast"
    USGS_QUAKE_URL: str = "https://earthquake.usgs.gov/fdsnws/event/1/query"

    # India bounding box for quake filtering
    INDIA_BBOX = {"minlat": 5.0, "maxlat": 38.0, "minlon": 66.0, "maxlon": 98.0}


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
