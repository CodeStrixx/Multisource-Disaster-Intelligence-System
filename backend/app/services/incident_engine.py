"""F6/F7: Incident lifecycle engine — dedupe, transitions, verification, expiry."""
from __future__ import annotations

import json
from datetime import timedelta
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..config import settings
from ..models import (
    Alert,
    Incident,
    IncidentEvidence,
    IncidentStatusHistory,
    RiskAssessment,
    utcnow,
)
from ..utils import ensure_utc, haversine_km
from . import risk as risk_svc
from .detection import Candidate

OPEN_STATUSES = {"DETECTED", "UNDER_REVIEW", "VERIFIED", "ACTIVE"}
TERMINAL_STATUSES = {"RESOLVED", "REJECTED", "EXPIRED"}

# F6 recommended flow
ALLOWED_TRANSITIONS: dict[str, set[str]] = {
    "DETECTED": {"UNDER_REVIEW", "VERIFIED", "REJECTED", "ACTIVE"},
    "UNDER_REVIEW": {"VERIFIED", "REJECTED", "ACTIVE"},
    "VERIFIED": {"ACTIVE", "RESOLVED"},
    "ACTIVE": {"RESOLVED", "EXPIRED"},
    "RESOLVED": set(),
    "REJECTED": set(),
    "EXPIRED": set(),
}

_AUTO_ACTIVE_LEVELS = {"HIGH", "CRITICAL"}


def find_open_incident(db: Session, cand: Candidate) -> Incident | None:
    """Dedupe: same disaster type AND signal kind within radius of an open incident.

    Matching on signal_kind keeps predicted (FORECAST_RISK) incidents distinct
    from already-observed ones, per PRD F4.
    """
    rows = db.scalars(
        select(Incident).where(
            Incident.type == cand.disaster_type,
            Incident.signal_kind == cand.signal_kind,
            Incident.status.in_(OPEN_STATUSES),
        )
    ).all()
    for inc in rows:
        if haversine_km(inc.latitude, inc.longitude, cand.latitude, cand.longitude) <= max(
            settings.CLUSTER_RADIUS_KM, inc.affected_radius_km * 0.75
        ):
            return inc
    return None


def _record_transition(
    db: Session, incident: Incident, new_status: str, reason: str, actor_type: str = "system"
) -> None:
    db.add(IncidentStatusHistory(
        incident_id=incident.id,
        previous_status=incident.status,
        new_status=new_status,
        reason=reason[:500],
        actor_type=actor_type,
    ))
    incident.status = new_status


def apply_candidate(db: Session, cand: Candidate) -> tuple[Incident, bool]:
    """Create or update an incident from a detection candidate. Returns (incident, created)."""
    now = utcnow()
    existing = find_open_incident(db, cand)
    created = False

    if existing:
        inc = existing
        prev_score = inc.risk_score or 0.0
    else:
        public_id = _new_public_id(cand.disaster_type)
        inc = Incident(
            public_id=public_id,
            type=cand.disaster_type,
            title=cand.title,
            summary=cand.summary,
            signal_kind=cand.signal_kind,
            latitude=cand.latitude,
            longitude=cand.longitude,
            location_name=cand.location_name,
            risk_level="LOW",
            risk_score=0.0,
            status="DETECTED",
            verification_status="UNVERIFIED",
            detected_at=now,
            updated_at=now,
            expires_at=now + timedelta(hours=settings.INCIDENT_EXPIRY_HOURS.get(cand.disaster_type, 48)),
        )
        db.add(inc)
        db.flush()
        db.add(IncidentStatusHistory(
            incident_id=inc.id,
            previous_status="DETECTED",
            new_status="DETECTED",
            reason=f"Auto-detected {cand.signal_kind.lower().replace('_', ' ')} via ingestion pipeline",
            actor_type="system",
        ))
        created = True
        prev_score = 0.0

    # ---- evidence (M7: every incident keeps >=1 source reference) ----
    for ev in cand.evidence:
        dup = any(
            e.reference_id == str(ev.get("reference_id")) and e.source_provider_id == str(ev.get("source_provider_id"))
            for e in inc.evidence
        )
        if not dup:
            inc.evidence.append(IncidentEvidence(
                source_provider_id=str(ev.get("source_provider_id", "")),
                evidence_type=str(ev.get("evidence_type", "provider_observation")),
                reference_id=str(ev.get("reference_id", "")),
                detail=str(ev.get("detail", "")),
                confidence_weight=float(ev.get("confidence_weight", 10.0)),
            ))

    # ---- risk assessment ----
    score_delta_note = ""
    if cand.risk.risk_score > (inc.risk_score or 0):
        score_delta_note = f"Risk escalated to {cand.risk.risk_level} ({cand.risk.risk_score:.0f}/100)."
    elif created or cand.risk.risk_score < (inc.risk_score or 0):
        score_delta_note = f"Risk re-assessed as {cand.risk.risk_level} ({cand.risk.risk_score:.0f}/100)."

    inc.risk_level = cand.risk.risk_level
    inc.risk_score = cand.risk.risk_score
    inc.title = cand.title if not created else inc.title
    inc.summary = cand.summary
    inc.signal_kind = cand.signal_kind
    inc.location_name = cand.location_name or inc.location_name
    inc.rainfall_mm = cand.rainfall_mm
    inc.temperature_c = cand.temperature_c
    inc.magnitude = cand.magnitude
    inc.updated_at = now
    inc.expires_at = now + timedelta(hours=settings.INCIDENT_EXPIRY_HOURS.get(inc.type, 48))

    db.add(RiskAssessment(
        incident_id=inc.id,
        risk_level=cand.risk.risk_level,
        risk_score=cand.risk.risk_score,
        factors_json=json.dumps(cand.risk.factors),
        rule_version=risk_svc.RULE_VERSION,
    ))

    # ---- trend from score history ----
    scores = [
        a.risk_score
        for a in sorted(db.scalars(select(RiskAssessment).where(RiskAssessment.incident_id == inc.id)).all(),
                        key=lambda a: a.calculated_at)[-4:]
    ] or [prev_score, inc.risk_score]
    if len(scores) >= 2 and scores[-1] > scores[0] + 5:
        inc.trend = "worsening"
    elif len(scores) >= 2 and scores[-1] < scores[0] - 5:
        inc.trend = "improving"
    else:
        inc.trend = "stable"

    # ---- confidence & verification (F7) ----
    distinct_sources = {e.source_provider_id for e in inc.evidence if e.source_provider_id}
    total_weight = sum(e.confidence_weight for e in inc.evidence)
    inc.confidence_score = min(99.0, 30.0 + total_weight * 0.6 + (10.0 if len(distinct_sources) > 1 else 0.0))
    if inc.verification_status == "UNVERIFIED" and len(distinct_sources) >= 2:
        inc.verification_status = "CORROBORATED"
    elif inc.verification_status == "UNVERIFIED" and total_weight >= 45:
        inc.verification_status = "CORROBORATED"

    # ---- lifecycle progression ----
    if created and inc.risk_level in _AUTO_ACTIVE_LEVELS:
        _record_transition(db, inc, "ACTIVE", f"Auto-activated on {inc.risk_level} risk detection")
    elif created:
        _record_transition(db, inc, "UNDER_REVIEW", f"Queued for review; risk={inc.risk_level}")
    else:
        if score_delta_note and inc.status in OPEN_STATUSES and inc.status != "ACTIVE":
            if inc.risk_level in _AUTO_ACTIVE_LEVELS:
                _record_transition(db, inc, "ACTIVE", score_delta_note)
        elif score_delta_note:
            inc.updated_at = now

    return inc, created


def _close_active_alerts(db: Session, incident_id: int, now=None) -> int:
    """End all ACTIVE alerts tied to an incident (used on expiry/resolution)."""
    closed = 0
    for al in db.scalars(select(Alert).where(Alert.incident_id == incident_id, Alert.status == "ACTIVE")).all():
        al.status = "EXPIRED"
        al.expires_at = al.expires_at or now or utcnow()
        closed += 1
    return closed


def expire_incidents(db: Session) -> int:
    """EC6/EC7: close out stale incidents using expiry rules and inactivity checks."""
    now = utcnow()
    expired_count = 0
    rows = db.scalars(select(Incident).where(Incident.status.in_(OPEN_STATUSES))).all()
    for inc in rows:
        exp = ensure_utc(inc.expires_at)
        inactive_h = (now - ensure_utc(inc.updated_at)).total_seconds() / 3600.0
        should_expire = (exp is not None and exp <= now) or inactive_h > settings.INCIDENT_EXPIRY_HOURS.get(inc.type, 48) * 2
        if should_expire:
            _record_transition(db, inc, "EXPIRED", "No corroborating signals before expiry window")
            inc.expires_at = inc.expires_at or now
            expired_count += 1
            _close_active_alerts(db, inc.id, now)

    # Independent alert sweep: retire any ACTIVE alert past its own expiry,
    # even if its parent incident was already resolved/closed earlier.
    stale_alerts = db.scalars(select(Alert).where(Alert.status == "ACTIVE")).all()
    for al in stale_alerts:
        exp = ensure_utc(al.expires_at)
        if exp is not None and exp <= now:
            al.status = "EXPIRED"
            expired_count += 1
    db.commit()
    return expired_count


def transition_incident(db: Session, incident: Incident, new_status: str, reason: str, actor: str) -> Incident:
    """Moderator-driven transition with full audit trail; validates allowed flow."""
    if new_status not in ALLOWED_TRANSITIONS.get(incident.status, set()):
        raise ValueError(
            f"Illegal transition {incident.status} -> {new_status}. Allowed: {sorted(ALLOWED_TRANSITIONS[incident.status])}"
        )
    _record_transition(db, incident, new_status, reason, actor_type="moderator")
    if new_status in ("RESOLVED", "REJECTED"):
        incident.resolved_at = utcnow()
    if new_status == "RESOLVED":
        # Disaster ended: retire its public alerts so the feed stays current.
        _close_active_alerts(db, incident.id)
    if new_status == "REJECTED":
        incident.verification_status = "REJECTED"
        for al in db.scalars(select(Alert).where(Alert.incident_id == incident.id, Alert.status == "ACTIVE")).all():
            al.status = "REVOKED"
            al.expires_at = utcnow()
    db.commit()
    db.refresh(incident)
    return incident


def _new_public_id(disaster_type: str) -> str:
    stamp = utcnow().strftime("%Y%m%d")
    import random

    suffix = "".join(random.choices("0123456789ABCDEF", k=4))
    return f"EVT-{disaster_type[:3].upper()}-{stamp}-{suffix}"


__all__ = [
    "apply_candidate",
    "expire_incidents",
    "transition_incident",
    "find_open_incident",
]
