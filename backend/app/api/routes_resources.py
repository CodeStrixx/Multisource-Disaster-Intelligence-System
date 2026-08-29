"""/resources — relief resource directory with nearby search (F8, user story 6)."""
from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Resource as ResourceModel
from ..serializers import serialize_resource
from ..utils import haversine_km

router = APIRouter(tags=["resources"])


@router.get("/resources")
def list_resources(
    type: str | None = Query(None),
    lat: float | None = Query(None, ge=-90, le=90),
    lng: float | None = Query(None, ge=-180, le=180),
    district: str | None = None,
    db: Session = Depends(get_db),
) -> list[dict[str, Any]]:
    stmt = select(ResourceModel).where(ResourceModel.is_active.is_(True))
    rows = db.scalars(stmt).all()
    out = []
    for r in rows:
        if type and r.type != type.lower():
            continue
        if district and (r.district or "").lower() != district.lower():
            continue
        out.append(serialize_resource(r, lat, lng))
    if lat is not None and lng is not None:
        out.sort(key=lambda r: r["distanceKm"] if r["distanceKm"] is not None else 9e9)
    return out


@router.get("/resources/nearby")
def nearby_resources(
    lat: float = Query(..., ge=-90, le=90),
    lng: float = Query(..., ge=-180, le=180),
    radius_km: float = Query(50.0, gt=0, le=1000),
    type: str | None = None,
    db: Session = Depends(get_db),
) -> list[dict[str, Any]]:
    rows = db.scalars(select(ResourceModel).where(ResourceModel.is_active.is_(True))).all()
    out = [
        serialize_resource(r, lat, lng)
        for r in rows
        if (haversine_km(lat, lng, r.latitude, r.longitude) <= radius_km)
        and (not type or r.type == type.lower())
    ]
    out.sort(key=lambda r: r["distanceKm"] or 9e9)
    return out


@router.get("/resources/{resource_id}")
def get_resource(resource_id: str, db: Session = Depends(get_db)) -> dict[str, Any]:
    res = db.scalar(select(ResourceModel).where(ResourceModel.public_id == resource_id))
    if not res:
        raise HTTPException(status_code=404, detail="Resource not found")
    return serialize_resource(res)
