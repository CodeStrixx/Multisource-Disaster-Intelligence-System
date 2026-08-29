"""/alerts — active public alerts feed (F10, user story 7)."""
from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Alert as AlertModel
from ..models import Incident
from ..serializers import serialize_alert

router = APIRouter(tags=["alerts"])


@router.get("/alerts")
def list_alerts(
    severity: str | None = Query(None, description="low|moderate|high|critical"),
    incident_id: str | None = Query(None),
    include_expired: bool = False,
    limit: int = Query(100, ge=1, le=300),
    db: Session = Depends(get_db),
) -> list[dict[str, Any]]:
    stmt = select(AlertModel).order_by(AlertModel.created_at.desc())
    rows = db.scalars(stmt.limit(400)).all()
    inc_map = {i.id: (i.public_id, i.type) for i in db.scalars(select(Incident)).all()}

    out = []
    for a in rows:
        if not include_expired and a.status not in ("ACTIVE",):
            continue
        if severity and (a.severity or "").lower() != severity.lower():
            continue
        if incident_id:
            pub_id, _ = inc_map.get(a.incident_id or -1, ("", ""))
            if pub_id != incident_id and str(a.incident_id or "") != incident_id:
                continue
        pub_id, inc_type = inc_map.get(a.incident_id or -1, ("", a.alert_type.split("_")[-1]))
        out.append(serialize_alert(a, pub_id, inc_type))
        if len(out) >= limit:
            break
    return out
