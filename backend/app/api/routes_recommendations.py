"""/recommendations — disaster-type safety guidance library (F9)."""
from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Recommendation
from ..serializers import serialize_recommendation

router = APIRouter(tags=["recommendations"])


@router.get("/recommendations")
def list_recommendations(
    disaster_type: str | None = Query(None, alias="type"),
    min_risk_level: str | None = Query(None),
    db: Session = Depends(get_db),
) -> list[dict[str, Any]]:
    """Returns guidance; official NDMA/SDMA instructions always listed first."""
    stmt = select(Recommendation).where(Recommendation.is_active.is_(True))
    rows = db.scalars(stmt).all()
    level_order = {"LOW": 0, "MODERATE": 1, "HIGH": 2, "CRITICAL": 3}
    prio = {"urgent": 0, "important": 1, "advisory": 2}

    out = []
    for r in rows:
        if disaster_type and r.disaster_type != disaster_type.lower():
            continue
        if min_risk_level:
            need = level_order.get(min_risk_level.upper(), 0)
            if level_order.get(r.min_risk_level, 0) > need:
                continue
        out.append((0 if r.is_official else 1, prio.get(r.priority, 3), r))

    out.sort(key=lambda t: (t[0], t[1]))
    return [serialize_recommendation(t[2]) for t in out]
