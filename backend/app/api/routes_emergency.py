"""/emergency-contacts — national emergency helpline directory (tap-to-call on frontend)."""
from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import EmergencyContact
from ..serializers import serialize_emergency_contact

router = APIRouter(tags=["emergency"])


@router.get("/emergency-contacts")
def list_emergency_contacts(
    category: str | None = Query(None, description="EMERGENCY|POLICE|FIRE|MEDICAL|DISASTER|HELPLINE"),
    db: Session = Depends(get_db),
) -> list[dict[str, Any]]:
    stmt = select(EmergencyContact).where(EmergencyContact.is_active.is_(True)).order_by(
        EmergencyContact.sort_order.asc()
    )
    rows = db.scalars(stmt).all()
    out = [serialize_emergency_contact(c) for c in rows]
    if category:
        needle = category.upper()
        out = [c for c in out if c["category"] == needle]
    return out
