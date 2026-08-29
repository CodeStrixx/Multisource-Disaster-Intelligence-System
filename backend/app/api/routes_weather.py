"""/weather + /rainfall — normalized observations with freshness flags (F2/EC5)."""
from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..serializers import serialize_weather
from ..services.ingestion import ingest_weather, latest_weather_for_point
from ..utils import valid_coords

router = APIRouter(tags=["weather"])


@router.get("/weather")
def get_weather(
    lat: float = Query(..., ge=-90, le=90),
    lng: float = Query(..., ge=-180, le=180),
    refresh: bool = False,
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    if not valid_coords(lat, lng):
        raise HTTPException(status_code=422, detail="Invalid coordinates")
    if refresh:
        ingest_weather(db)
    obs, stale = latest_weather_for_point(db, lat, lng)
    return serialize_weather(obs, is_stale=stale)


@router.get("/rainfall")
def get_rainfall(
    lat: float = Query(..., ge=-90, le=90),
    lng: float = Query(..., ge=-180, le=180),
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    obs, stale = latest_weather_for_point(db, lat, lng)
    payload = serialize_weather(obs, is_stale=stale)
    return {
        "location": payload["location"],
        "latitude": payload["latitude"],
        "longitude": payload["longitude"],
        "timestamp": payload["timestamp"],
        "rainfallMm1h": payload["rainfallMm1h"],
        "rainfallMm24h": payload["rainfallMm24h"],
        "warningLevel": payload["warningLevel"],
        "isStale": stale,
        "provider": payload["provider"],
    }
