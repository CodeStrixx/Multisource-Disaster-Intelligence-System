"""V2 admin/moderator API — verification workflow + resource management (F7/F8, user stories 9-10).

Protected by X-Admin-Secret header (demo-only, per PRD Q6).
"""
from __future__ import annotations

from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Resource as ResourceModel
from ..models import utcnow
from ..serializers import serialize_incident, serialize_resource
from ..services.incident_engine import ALLOWED_TRANSITIONS, transition_incident
from .deps import require_admin_secret

router = APIRouter(
    tags=["admin"],
    dependencies=[Depends(require_admin_secret)],
)


class StatusChange(BaseModel):
    new_status: str = Field(..., description="UNDER_REVIEW|VERIFIED|ACTIVE|RESOLVED|REJECTED")
    reason: str = Field(default="", max_length=500)


class VerificationChange(BaseModel):
    action: str = Field(..., description="verify | reject | corroborate")
    reason: str = Field(default="", max_length=500)


class ResourceUpsert(BaseModel):
    name: str = Field(..., max_length=255)
    type: str = Field(..., description="shelter|hospital|relief_centre|police|fire_station")
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    address: str = ""
    district: str = ""
    state: str = ""
    contact_number: str = ""
    capacity: str | None = None
    availability_status: str = "OPEN"
    available_beds_or_kits: int | None = None
    source_name: str = "Moderator entry"


class ResourceStatusPatch(BaseModel):
    availability_status: str = Field(..., description="OPEN|LIMITED|FULL|CLOSED|UNKNOWN")
    available_beds_or_kits: int | None = None


def _get_incident(db: Session, incident_id: str) -> Incident:
    from ..models import Incident

    inc = db.scalar(select(Incident).where(Incident.public_id == incident_id))
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    return inc


@router.post("/pipeline/trigger")
def trigger_pipeline(ingest: bool = True, db: Session = Depends(get_db)) -> dict[str, Any]:
    """Manually run an ingestion + detection + alerting pass (demo/testing aid).

    Pass ?ingest=false to skip provider fetching and only re-run detection
    over already-stored signals.
    """
    if ingest:
        from ..services.pipeline import run_full_pipeline

        return run_full_pipeline(db)
    from ..services.pipeline import run_detection_only

    return run_detection_only(db)


@router.get("/incidents/{incident_id}")
def admin_incident_detail(incident_id: str, db: Session = Depends(get_db)) -> dict[str, Any]:
    """Evidence bundle for moderator review (user story 8)."""
    _get_incident(db, incident_id)
    from ..api.routes_incidents import get_incident_evidence

    return get_incident_evidence(incident_id=incident_id, db=db)  # reuse serializer logic


@router.post("/incidents/{incident_id}/status")
def change_status(incident_id: str, payload: StatusChange, db: Session = Depends(get_db)) -> dict[str, Any]:
    inc = _get_incident(db, incident_id)
    try:
        transition_incident(db, inc, payload.new_status.upper(), payload.reason or "Moderator action", actor="moderator")
    except ValueError as exc:
        allowed = sorted(ALLOWED_TRANSITIONS.get(inc.status, set()))
        raise HTTPException(status_code=409, detail=f"{exc}. Allowed from {inc.status}: {allowed}")
    return serialize_incident(db, inc)


@router.post("/incidents/{incident_id}/verification")
def change_verification(incident_id: str, payload: VerificationChange, db: Session = Depends(get_db)) -> dict[str, Any]:
    """F7 verification workflow: verify/reject/corroborate with audit trail."""
    inc = _get_incident(db, incident_id)
    action = payload.action.lower()
    if action == "verify":
        inc.verification_status = "VERIFIED"
        if inc.status in ("DETECTED", "UNDER_REVIEW"):
            transition_incident(db, inc, "VERIFIED", payload.reason or "Verified by moderator", actor="moderator")
            transition_incident(db, inc, "ACTIVE", "Activated after verification", actor="moderator")
    elif action == "reject":
        inc.verification_status = "REJECTED"
        if inc.status in ("DETECTED", "UNDER_REVIEW", "VERIFIED", "ACTIVE"):
            transition_incident(db, inc, "REJECTED", payload.reason or "Rejected by moderator (false positive)", actor="moderator")
    elif action == "corroborate":
        inc.verification_status = "CORROBORATED"
        if inc.status == "DETECTED":
            transition_incident(db, inc, "UNDER_REVIEW", payload.reason or "Corroborated; pending full review", actor="moderator")
    else:
        raise HTTPException(status_code=422, detail="action must be verify|reject|corroborate")
    db.commit()
    db.refresh(inc)
    return serialize_incident(db, inc)


@router.get("/resources")
def admin_list_resources(db: Session = Depends(get_db)) -> list[dict[str, Any]]:
    rows = db.scalars(select(ResourceModel).order_by(ResourceModel.id)).all()
    return [serialize_resource(r) for r in rows]


@router.post("/resources", status_code=201)
def create_resource(payload: ResourceUpsert, db: Session = Depends(get_db)) -> dict[str, Any]:
    valid_types = {"shelter", "hospital", "relief_centre", "police", "fire_station"}
    if payload.type.lower() not in valid_types:
        raise HTTPException(status_code=422, detail=f"type must be one of {sorted(valid_types)}")
    now = utcnow()
    stamp = now.strftime("%Y%m%d%H%M%S")
    res = ResourceModel(
        public_id=f"RES-ADM-{stamp}",
        name=payload.name,
        type=payload.type.lower(),
        latitude=payload.latitude,
        longitude=payload.longitude,
        address=payload.address,
        district=payload.district,
        state=payload.state,
        contact_number=payload.contact_number,
        capacity=payload.capacity,
        availability_status=payload.availability_status.upper(),
        available_beds_or_kits=payload.available_beds_or_kits,
        source_name=payload.source_name,
        last_verified_at=now,
    )
    db.add(res)
    db.commit()
    db.refresh(res)
    return serialize_resource(res)


@router.patch("/resources/{resource_id}")
def update_resource(resource_id: str, payload: ResourceStatusPatch, db: Session = Depends(get_db)) -> dict[str, Any]:
    res = db.scalar(select(ResourceModel).where(ResourceModel.public_id == resource_id))
    if not res:
        raise HTTPException(status_code=404, detail="Resource not found")
    res.availability_status = payload.availability_status.upper()
    if payload.available_beds_or_kits is not None:
        res.available_beds_or_kits = payload.available_beds_or_kits
    res.last_verified_at = utcnow()
    db.commit()
    db.refresh(res)
    return serialize_resource(res)
