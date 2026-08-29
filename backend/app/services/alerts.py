"""F10: Alerts — triggered on HIGH/CRITICAL incidents and meaningful escalations, deduped (EC7)."""
from __future__ import annotations

import json
from datetime import timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models import Alert, Incident, Recommendation, utcnow
from . import risk as risk_svc


def _recommendation_actions(db: Session, inc: Incident, limit: int = 2) -> list[str]:
    rows = db.scalars(
        select(Recommendation).where(
            Recommendation.disaster_type == inc.type,
            Recommendation.is_active.is_(True),
        )
    ).all()
    min_order = risk_svc.level_value(inc.risk_level)
    eligible = [r for r in rows if risk_svc.level_value(r.min_risk_level) <= max(min_order, 1)]
    prio = {"urgent": 0, "important": 1, "advisory": 2}
    return [r.instruction for r in sorted(eligible, key=lambda x: (prio.get(x.priority, 3), -x.id))[:limit]]


def _build_alert_copy(db: Session, inc: Incident) -> tuple[str, str, str]:
    type_label = inc.type.replace("_", " ").title()
    prefix = "CRITICAL" if inc.risk_level == "CRITICAL" else f"{inc.risk_level.title()}"
    kind_note = (
        "Predicted within the next 24 hours"
        if (inc.signal_kind or "").upper() == "FORECAST_RISK"
        else "Currently observed"
    )
    title = f"{prefix} {type_label} ALERT: {inc.location_name or 'Monitored Region'}"

    # Official directives (curated government channels) take precedence in messaging.
    official: list[str] = []
    try:
        raw = json.loads(inc.official_warnings_json or "[]") if isinstance(inc.official_warnings_json, str) else []
        official = [w for w in raw if w]
    except (json.JSONDecodeError, TypeError):
        official = []

    parts = [f"{kind_note}. {inc.summary}".strip()]
    if official:
        parts.append(f"Official directive: {official[0]}")
    message = " ".join(parts) + f" (Risk {inc.risk_score:.0f}/100; confidence {inc.confidence_score:.0f}%)."

    recs = _recommendation_actions(db, inc)
    action = recs[0] if recs else (official[0] if official else "Monitor official channels and follow local authority instructions.")
    return title, message, action


def generate_alerts_for_incident(db: Session, incident: Incident) -> list[Alert]:
    """Create alert only when severity is high/critical AND no duplicate exists (EC7).

    Dedup key: incident_id + severity + alert_type. Regenerated only on worsening trend.
    """
    created: list[Alert] = []
    if incident.verification_status == "REJECTED" or incident.status not in {
        "DETECTED", "UNDER_REVIEW", "VERIFIED", "ACTIVE"
    }:
        return created
    if incident.risk_level not in ("HIGH", "CRITICAL"):
        return created

    severity = incident.risk_level.lower()
    alert_type = f"risk_{severity}"

    existing = db.scalar(select(Alert).where(
        Alert.incident_id == incident.id,
        Alert.severity == severity,
        Alert.alert_type == alert_type,
        Alert.status.in_(("ACTIVE", "EXPIRED")),
    ))
    if existing:
        # Only create a new one when there is a meaningful change
        if incident.trend != "worsening":
            return created
        existing.status = "SUPERSEDED"

    now = utcnow()
    title, message, action = _build_alert_copy(db, incident)
    alert = Alert(
        public_id=f"ALT-{now.strftime('%Y%m%d')}-{incident.public_id[-8:]}-{len(alert_type)}",
        incident_id=incident.id,
        alert_type=alert_type,
        title=title[:255],
        message=message,
        severity=severity,
        affected_area=incident.location_name or f"{incident.latitude:.2f}, {incident.longitude:.2f}",
        recommended_action=action,
        status="ACTIVE",
        expires_at=incident.expires_at or now + timedelta(hours=12),
    )
    db.add(alert)
    created.append(alert)
    return created


__all__ = ["generate_alerts_for_incident"]
