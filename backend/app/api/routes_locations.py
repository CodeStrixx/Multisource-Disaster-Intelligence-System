"""/locations — curated monitored locations (frontend saved-location contract)."""
from __future__ import annotations

from typing import Any

from fastapi import APIRouter

from ..seed import MONITOR_LOCATIONS

router = APIRouter(tags=["locations"])


@router.get("/locations")
def locations(q: str | None = None) -> list[dict[str, Any]]:
    items = MONITOR_LOCATIONS
    if q:
        needle = q.lower()
        items = [
            loc for loc in items
            if needle in loc["name"].lower()
            or needle in loc["district"].lower()
            or needle in loc["state"].lower()
        ]
    return [
        {
            "name": loc["name"],
            "district": loc["district"],
            "state": loc["state"],
            "lat": loc["lat"],
            "lng": loc["lng"],
        }
        for loc in items
    ]
