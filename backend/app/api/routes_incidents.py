"""/incidents — public incident API returning the frontend DisasterEvent contract (F6/F7)."""
from __future__ import annotations

import json
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Alert as AlertModel
from ..models import Incident
from ..models import Resource as ResourceModel
from ..serializers import (
    _source_registry,
    serialize_alert,
    serialize_incident,
    serialize_resource,
)
from ..utils import haversine_km

router = APIRouter(tags=["incidents"])

PUBLIC_STATUSES = {"DETECTED", "UNDER_REVIEW", "VERIFIED", "ACTIVE", "RESOLVED"}


def _get_incident_or_404(db: Session, incident_id: str) -> Incident:
    inc = db.scalar(select(Incident).where(Incident.public_id == incident_id))
    if not inc:
        try:
            inc = db.get(Incident, int(incident_id))
        except ValueError:
            inc = None
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    return inc


@router.get("/incidents")
def list_incidents(
    type: str | None = Query(None, description="flood|heavy_rain|cyclone|landslide|earthquake|heatwave"),
    status: str | None = Query(None),
    min_severity: str | None = Query(None, description="LOW|MODERATE|HIGH|CRITICAL"),
    include_resolved: bool = False,
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
) -> list[dict[str, Any]]:
    stmt = select(Incident).order_by(Incident.risk_score.desc(), Incident.updated_at.desc())
    rows = db.scalars(stmt).all()

    sev_order = {"LOW": 0, "MODERATE": 1, "HIGH": 2, "CRITICAL": 3}
    out = []
    for inc in rows:
        if not include_resolved and inc.status in {"RESOLVED", "EXPIRED", "REJECTED"}:
            continue
        if type and inc.type != type.lower():
            continue
        if status and inc.status != status.upper():
            continue
        if min_severity and sev_order.get(inc.risk_level, 0) < sev_order.get(min_severity.upper(), 0):
            continue
        out.append(inc)
    registry = _source_registry(db)
    return [serialize_incident(db, inc, registry) for inc in out[:limit]]


@router.get("/incidents/nearby")
def nearby_incidents(
    lat: float = Query(..., ge=-90, le=90),
    lng: float = Query(..., ge=-180, le=180),
    radius_km: float = Query(150.0, gt=0, le=2000),
    db: Session = Depends(get_db),
) -> list[dict[str, Any]]:
    rows = db.scalars(select(Incident)).all()
    hits = [
        r for r in rows
        if r.status not in {"REJECTED"}
        and haversine_km(lat, lng, r.latitude, r.longitude)
        <= radius_km + (r.affected_radius_km or 0)
    ]
    hits.sort(key=lambda r: -r.risk_score)
    registry = _source_registry(db)
    return [serialize_incident(db, inc, registry) for inc in hits[:100]]


@router.get("/incidents/{incident_id}")
def get_incident(incident_id: str, db: Session = Depends(get_db)) -> dict[str, Any]:
    inc = _get_incident_or_404(db, incident_id)
    return serialize_incident(db, inc)


@router.get("/incidents/{incident_id}/evidence")
def get_incident_evidence(incident_id: str, db: Session = Depends(get_db)) -> dict[str, Any]:
    """Moderator evidence view (user story 8)."""
    inc = _get_incident_or_404(db, incident_id)
    from ..models import IncidentStatusHistory, RiskAssessment

    assessments = db.scalars(
        select(RiskAssessment).where(RiskAssessment.incident_id == inc.id).order_by(RiskAssessment.calculated_at.desc())
    ).all()
    history = db.scalars(
        select(IncidentStatusHistory)
        .where(IncidentStatusHistory.incident_id == inc.id)
        .order_by(IncidentStatusHistory.created_at.asc())
    ).all()
    return {
        "incident": serialize_incident(db, inc),
        "signal_kind": inc.signal_kind,
        "evidence": [
            {
                "id": ev.id,
                "source_provider_id": ev.source_provider_id,
                "evidence_type": ev.evidence_type,
                "reference_id": ev.reference_id,
                "detail": ev.detail,
                "confidence_weight": ev.confidence_weight,
                "added_at": ev.added_at.isoformat() if ev.added_at else None,
            }
            for ev in sorted(inc.evidence, key=lambda e: -e.confidence_weight)
        ],
        "risk_assessments": [
            {
                "risk_level": a.risk_level,
                "risk_score": a.risk_score,
                "factors": json.loads(a.factors_json or "[]"),
                "rule_version": a.rule_version,
                "calculated_at": a.calculated_at.isoformat() if a.calculated_at else None,
            }
            for a in assessments
        ],
        "status_history": [
            {
                "previous_status": h.previous_status,
                "new_status": h.new_status,
                "reason": h.reason,
                "actor_type": h.actor_type,
                "created_at": h.created_at.isoformat() if h.created_at else None,
            }
            for h in history
        ],
    }


@router.get("/dashboard")
def dashboard_bundle(
    lat: float | None = Query(None, ge=-90, le=90),
    lng: float | None = Query(None, ge=-180, le=180),
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    """Single aggregated call powering the frontend polling loop (M3 target <2s)."""
    registry = _source_registry(db)
    events = [
        serialize_incident(db, inc, registry)
        for inc in db.scalars(
            select(Incident).order_by(Incident.risk_score.desc(), Incident.updated_at.desc())
        ).all()
        if inc.status not in {"RESOLVED", "EXPIRED", "REJECTED"}
    ]

    alert_rows = db.scalars(
        select(AlertModel).order_by(AlertModel.created_at.desc()).limit(60)
    ).all()
    id_to_public = {i.id: (i.public_id, i.type) for i in db.scalars(select(Incident)).all()}

    res_rows = db.scalars(select(ResourceModel).where(ResourceModel.is_active.is_(True))).all()
    resources_out = [serialize_resource(r, lat, lng) for r in res_rows]
    if lat is not None:
        resources_out.sort(key=lambda r: r["distanceKm"] if r["distanceKm"] is not None else 9e9)

    return {
        "events": events,
        "alerts": [
            serialize_alert(a, *id_to_public.get(a.incident_id or -1, ("", a.alert_type.split("_")[0])))
            for a in alert_rows
        ],
        "resources": resources_out,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
    }
