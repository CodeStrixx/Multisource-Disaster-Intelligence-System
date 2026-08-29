"""/schemes — official government assistance schemes for disaster-affected people."""
from __future__ import annotations

import json
from typing import Any

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import GovernmentScheme, Incident
from ..serializers import serialize_scheme
from ..utils import haversine_km

router = APIRouter(tags=["schemes"])


def _active_schemes(db: Session) -> list[GovernmentScheme]:
    return db.scalars(
        select(GovernmentScheme).where(GovernmentScheme.is_active.is_(True)).order_by(GovernmentScheme.id)
    ).all()


@router.get("/schemes")
def list_schemes(
    type: str | None = Query(None, description="filter by disaster type: flood|heavy_rain|cyclone|landslide|earthquake|heatwave"),
    q: str | None = Query(None, description="free-text search on name/body/summary"),
    db: Session = Depends(get_db),
) -> list[dict[str, Any]]:
    out = []
    for s in _active_schemes(db):
        if type:
            types = json.loads(s.applicable_disaster_types_json or "[]")
            if type.lower() not in types:
                continue
        if q:
            needle = q.lower()
            haystack = f"{s.name} {s.administering_body} {s.summary}".lower()
            if needle not in haystack:
                continue
        out.append(serialize_scheme(s))
    return out


@router.get("/schemes/relevant")
def relevant_schemes(
    lat: float = Query(..., ge=-90, le=90),
    lng: float = Query(..., ge=-180, le=180),
    radius_km: float = Query(300.0, gt=0, le=2000),
    db: Session = Depends(get_db),
) -> list[dict[str, Any]]:
    """Schemes matched to ACTIVE hazards near the given location (personalized view).

    Each result is annotated with the open incidents that made it relevant.
    """
    open_incidents = [
        i for i in db.scalars(select(Incident)).all()
        if i.status in {"DETECTED", "UNDER_REVIEW", "VERIFIED", "ACTIVE"}
        and haversine_km(lat, lng, i.latitude, i.longitude) <= radius_km + (i.affected_radius_km or 0)
    ]

    out: list[dict[str, Any]] = []
    seen: set[str] = set()
    for inc in sorted(open_incidents, key=lambda x: -x.risk_score):
        for s in _active_schemes(db):
            types = json.loads(s.applicable_disaster_types_json or "[]")
            if inc.type not in types:
                continue
            hazard_ref = {"id": inc.public_id, "type": inc.type, "title": inc.title, "severity": inc.risk_level}
            if s.scheme_code in seen:
                # append this hazard to the already-returned scheme entry
                entry = next(e for e in out if e["id"] == s.scheme_code)
                if hazard_ref["id"] not in {h["id"] for h in entry["matchedHazards"]}:
                    entry["matchedHazards"].append(hazard_ref)
                continue
            out.append(serialize_scheme(s, matched_hazards=[hazard_ref]))
            seen.add(s.scheme_code)
    return out
