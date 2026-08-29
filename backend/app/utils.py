"""Shared geo + time helpers (portable across SQLite/Postgres, no PostGIS dependency)."""
from __future__ import annotations

import math
from datetime import datetime, timezone


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Great-circle distance between two points in kilometres."""
    if None in (lat1, lon1, lat2, lon2):
        return float("inf")
    r = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlmb = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlmb / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


def ensure_utc(dt: datetime | None) -> datetime | None:
    if dt is None:
        return None
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def parse_iso_utc(value: str | None) -> datetime | None:
    """Parse an ISO timestamp; naive values are assumed to be UTC."""
    if not value:
        return None
    try:
        dt = datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except ValueError:
        try:
            dt = datetime.fromisoformat(str(value)[:19])
        except ValueError:
            return None
    return ensure_utc(dt)


def iso(dt: datetime | None) -> str | None:
    dt = ensure_utc(dt)
    return dt.isoformat() if dt else None


def rel_time(dt: datetime | None) -> str:
    """Human-friendly 'X mins ago' style string used by the frontend DataSource.lastSync."""
    dt = ensure_utc(dt)
    if not dt:
        return "never"
    secs = max(0, int((datetime.now(timezone.utc) - dt).total_seconds()))
    if secs < 60:
        return "just now"
    mins = secs // 60
    if mins < 60:
        return f"{mins} min{'s' if mins != 1 else ''} ago"
    hours = mins // 60
    if hours < 24:
        return f"{hours} hour{'s' if hours != 1 else ''} ago"
    days = hours // 24
    return f"{days} day{'s' if days != 1 else ''} ago"


def valid_coords(lat: float, lng: float) -> bool:
    """EC4: reject invalid coordinates."""
    try:
        lat_f, lng_f = float(lat), float(lng)
    except (TypeError, ValueError):
        return False
    return -90.0 <= lat_f <= 90.0 and -180.0 <= lng_f <= 180.0
