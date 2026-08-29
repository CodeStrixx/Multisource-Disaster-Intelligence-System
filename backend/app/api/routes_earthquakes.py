"""/earthquakes — recent normalized seismic events (F3)."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import EarthquakeEvent
from ..serializers import serialize_earthquake

router = APIRouter(tags=["earthquakes"])


@router.get("/earthquakes")
def recent_earthquakes(
    hours: int = Query(48, ge=1, le=336),
    min_magnitude: float | None = Query(None, ge=0, le=10),
    db: Session = Depends(get_db),
):
    since = datetime.now(timezone.utc) - timedelta(hours=hours)
    stmt = select(EarthquakeEvent).where(EarthquakeEvent.occurred_at >= since).order_by(EarthquakeEvent.occurred_at.desc())
    if min_magnitude is not None:
        stmt = stmt.where(EarthquakeEvent.magnitude >= min_magnitude)
    rows = db.scalars(stmt.limit(200)).all()
    return [serialize_earthquake(q) for q in rows]
