"""V2 citizen reports API — required by the existing frontend report flow (F12)."""
from __future__ import annotations

from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from ..config import settings
from ..database import get_db
from ..models import CitizenReport, Incident, IncidentEvidence, utcnow
from ..serializers import serialize_report
from ..utils import valid_coords

router = APIRouter(tags=["reports"])


class ReportCreate(BaseModel):
    userName: str = Field(default="Anonymous Citizen", max_length=128)
    type: str = Field(..., description="flood|heavy_rain|cyclone|landslide|earthquake|heatwave")
    description: str = Field(..., min_length=5)
    lat: float
    lng: float
    locationName: str = Field(default="", max_length=255)
    eventId: str | None = None
    mediaUrl: str | None = None
    evidenceNotes: str | None = None


ALLOWED_TYPES = {"flood", "heavy_rain", "cyclone", "landslide", "earthquake", "heatwave"}


def _apply_verification_rules(db: Session, rep: CitizenReport) -> bool:
    """Promote community-verified reports: >= REPORT_VERIFY_UPVOTES upvotes => VERIFIED.

    Also strengthens the linked incident's citizen evidence, since a report the
    community has corroborated is more trustworthy than a fresh one.
    Returns True if the report was promoted.
    """
    if rep.verification_status in ("UNDER_REVIEW", "UNVERIFIED") and (rep.upvotes or 0) >= settings.REPORT_VERIFY_UPVOTES:
        rep.verification_status = "VERIFIED"
        rep.confidence_score = max(rep.confidence_score or 0, 90.0)
        rep.updated_at = utcnow()
        if rep.linked_incident_id:
            from sqlalchemy import select

            inc = db.scalar(select(Incident).where(Incident.id == rep.linked_incident_id))
            if inc:
                for ev in inc.evidence:
                    if ev.reference_id == rep.public_id and ev.evidence_type == "citizen_report":
                        ev.confidence_weight = max(ev.confidence_weight or 12.0, 22.0)
                        if "community-verified" not in (ev.detail or ""):
                            ev.detail = f"{ev.detail} [community-verified: {rep.upvotes} upvotes]"
                db.add(inc)
        db.add(rep)
        return True
    return False


@router.post("/reports", status_code=201)
def create_report(payload: ReportCreate, db: Session = Depends(get_db)) -> dict[str, Any]:
    if payload.type not in ALLOWED_TYPES:
        raise HTTPException(status_code=422, detail=f"type must be one of {sorted(ALLOWED_TYPES)}")
    if not valid_coords(payload.lat, payload.lng):
        raise HTTPException(status_code=422, detail="Invalid coordinates")

    now = utcnow()
    linked_incident = None
    if payload.eventId:
        linked_incident = db.query(Incident).filter(Incident.public_id == payload.eventId).first()

    stamp = now.strftime("%Y%m%d%H%M%S")
    rep = CitizenReport(
        public_id=f"REP-{stamp}-{len(payload.userName) % 97:02d}",
        user_name=payload.userName,
        linked_incident_id=linked_incident.id if linked_incident else None,
        type=payload.type,
        description=payload.description,
        latitude=payload.lat,
        longitude=payload.lng,
        location_name=payload.locationName,
        media_url=payload.mediaUrl,
        evidence_notes=payload.evidenceNotes,
        verification_status="UNDER_REVIEW",
        confidence_score=50.0,
        upvotes=1,
    )
    db.add(rep)

    # Attach citizen report as corroborating evidence to the nearest matching open incident
    from sqlalchemy import select

    open_incidents = db.scalars(
        select(Incident).where(
            Incident.type == payload.type,
            Incident.status.in_(("DETECTED", "UNDER_REVIEW", "VERIFIED", "ACTIVE")),
        )
    ).all()

    def _dist(inc: Incident) -> float:
        dlat = inc.latitude - payload.lat
        dlng = inc.longitude - payload.lng
        return (dlat * dlat + dlng * dlng) ** 0.5 * 111.0  # approx km

    target = linked_incident
    if target is None and open_incidents:
        target = min(open_incidents, key=_dist)
        if _dist(target) > max(settings.CLUSTER_RADIUS_KM, target.affected_radius_km):
            target = None
    if target is not None:
        target.evidence.append(IncidentEvidence(
            source_provider_id="citizen_sentinel",
            evidence_type="citizen_report",
            reference_id=rep.public_id,
            detail=f"Citizen field report by {rep.user_name}: {rep.description[:160]}",
            confidence_weight=12.0,
        ))
        rep.linked_incident_id = target.id
        # corroboration bump
        distinct_citizen = sum(1 for e in target.evidence if e.evidence_type == "citizen_report")
        rep.confidence_score = min(85.0, 50.0 + distinct_citizen * 8)
        db.add(target)

    db.commit()
    db.refresh(rep)
    return serialize_report(rep)


@router.get("/reports")
def list_reports(limit: int = 100, db: Session = Depends(get_db)) -> list[dict[str, Any]]:
    rows = db.query(CitizenReport).order_by(CitizenReport.created_at.desc()).limit(min(limit, 300)).all()
    # lazy promotion catches reports that crossed the threshold via other paths
    changed = False
    for r in rows:
        if _apply_verification_rules(db, r):
            changed = True
    if changed:
        db.commit()
    return [serialize_report(r) for r in rows]


@router.post("/reports/{report_id}/upvote")
def upvote_report(report_id: str, db: Session = Depends(get_db)) -> dict[str, Any]:
    rep = db.query(CitizenReport).filter(CitizenReport.public_id == report_id).first()
    if not rep:
        raise HTTPException(status_code=404, detail="Report not found")
    rep.upvotes = (rep.upvotes or 0) + 1
    rep.confidence_score = min(95.0, (rep.confidence_score or 50) + 2)
    promoted = _apply_verification_rules(db, rep)
    rep.updated_at = utcnow()
    db.commit()
    db.refresh(rep)
    out = serialize_report(rep)
    out["justVerified"] = promoted
    return out
