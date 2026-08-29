"""Serialize internal models into the EXACT camelCase contract the existing
frontend TypeScript types expect (src/types/disaster.ts) — PRD Q1 requirement.
"""
from __future__ import annotations

import json
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import (
    Alert,
    CitizenReport,
    DataSource,
    EmergencyContact,
    GovernmentScheme,
    Incident,
    IncidentEvidence,
    Recommendation,
    Resource,
    RiskAssessment,
    WeatherObservation,
    utcnow,
)
from .utils import haversine_km, iso, rel_time

# ---- enum mappings -------------------------------------------------------
_SEVERITY_MAP = {"LOW": "low", "MODERATE": "moderate", "HIGH": "high", "CRITICAL": "critical"}

_STATUS_TO_FRONTEND = {
    "DETECTED": "monitoring",
    "UNDER_REVIEW": "monitoring",
    "VERIFIED": "monitoring",
    "ACTIVE": "active",
    "RESOLVED": "resolved",
    "EXPIRED": "resolved",
    "REJECTED": "resolved",
}

_RESOURCE_STATUS_MAP = {
    "OPEN": "open", "LIMITED": "busy", "FULL": "full", "CLOSED": "closed", "UNKNOWN": "closed",
}

_VERIFICATION_PASSTHROUGH = {"UNVERIFIED", "UNDER_REVIEW", "CORROBORATED", "VERIFIED", "REJECTED"}


def _loads(text: str | None, default: Any) -> Any:
    try:
        return json.loads(text) if text else default
    except json.JSONDecodeError:
        return default


def _verification_status(v: str | None) -> str:
    v = (v or "UNVERIFIED").upper()
    return v if v in _VERIFICATION_PASSTHROUGH else "UNVERIFIED"


# ---------------------------------------------------------------------------
def _source_registry(db: Session) -> dict[str, DataSource]:
    rows = db.scalars(select(DataSource)).all()
    return {r.provider_id: r for r in rows}


def serialize_source(db_src: DataSource) -> dict[str, Any]:
    last_sync = db_src.last_success_at or db_src.created_at
    age_h = 0.0
    if last_sync is not None:
        from .utils import ensure_utc

        age_h = max(0.0, (utcnow() - ensure_utc(last_sync)).total_seconds() / 3600.0)
    status = db_src.status or "active"
    if age_h > 24:
        status = "stale"
    elif age_h > 2 and status == "active":
        status = "delayed"
    return {
        "id": f"src-{db_src.id}",
        "providerId": db_src.provider_id,
        "name": db_src.name,
        "type": db_src.type or "official",
        "reliabilityScore": round(float(db_src.reliability_score or 90), 1),
        "lastSync": rel_time(last_sync),
        "status": status,
        "channelLogo": None,
        "regionalLanguage": None,
        "bureauLocation": None,
    }


def incident_sources(db: Session, inc: Incident, registry: dict[str, DataSource]) -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    seen: set[str] = set()
    for ev in inc.evidence:
        pid = ev.source_provider_id
        if not pid or pid in seen:
            continue
        seen.add(pid)
        src = registry.get(pid)
        if src:
            out.append(serialize_source(src))
        else:
            out.append({
                "id": f"prov-{pid}",
                "providerId": pid,
                "name": pid.replace("_", " ").title(),
                "type": "trusted",
                "reliabilityScore": 85.0,
                "lastSync": rel_time(ev.added_at),
                "status": "active",
                "channelLogo": None,
                "regionalLanguage": None,
                "bureauLocation": None,
            })
    return out


def incident_verification_factors(inc: Incident) -> list[dict[str, Any]]:
    """Evidence -> machine-readable verification factors (M6/M7 explainability)."""
    factors: list[dict[str, Any]] = []
    for ev in sorted(inc.evidence, key=lambda e: -e.confidence_weight):
        confirmed = inc.status != "DETECTED" or len(inc.evidence) > 1
        factors.append({
            "factor": ev.detail.split("(")[0].strip()[:80] or ev.evidence_type.replace("_", " ").title(),
            "score": round(float(ev.confidence_weight), 1),
            "status": "confirmed" if confirmed else "pending",
            "description": ev.detail,
        })
    return factors


def incident_risk_factors(inc: Incident, latest_assessment: RiskAssessment | None) -> list[dict[str, Any]]:
    raw_factors: list[str] = []
    if latest_assessment is not None:
        raw_factors = _loads(latest_assessment.factors_json, [])
    else:
        raw_factors = []
    impacts = {
        "flood": "Waterlogging expected in low-lying zones",
        "heavy_rain": "Localised waterlogging and traffic disruption likely",
        "landslide": "Slope failure risk on unstable terrain",
        "cyclone": "Structural damage and coastal surge possible",
        "earthquake": "Shaking felt across the affected radius",
        "heatwave": "Heat-stress risk for vulnerable groups",
    }
    return [
        {"factor": f, "impact": impacts.get(inc.type, "Monitor official advisories")}
        for f in raw_factors
    ]


def incident_recommendations(db: Session, inc: Incident) -> list[str]:
    rows = db.scalars(
        select(Recommendation).where(
            Recommendation.disaster_type == inc.type,
            Recommendation.is_active.is_(True),
        )
    ).all()
    level_order = {"LOW": 0, "MODERATE": 1, "HIGH": 2, "CRITICAL": 3}
    cur = level_order.get(inc.risk_level, 1)
    eligible = [r for r in rows if level_order.get(r.min_risk_level, 0) <= max(cur, 1)]
    prio = {"urgent": 0, "important": 1, "advisory": 2}
    official_first = sorted(eligible, key=lambda r: (0 if r.is_official else 1, prio.get(r.priority, 3)))
    return [r.instruction for r in official_first]


def serialize_incident(db: Session, inc: Incident, registry: dict[str, DataSource] | None = None,
                       latest_assessment: RiskAssessment | None = None) -> dict[str, Any]:
    if registry is None:
        registry = _source_registry(db)
    if latest_assessment is None:
        latest_assessment = (
            db.scalars(
                select(RiskAssessment)
                .where(RiskAssessment.incident_id == inc.id)
                .order_by(RiskAssessment.calculated_at.desc())
                .limit(1)
            ).first()
        )

    population_estimate = int((inc.affected_radius_km or 10) ** 2 * 3.14159 * 180)

    return {
        "id": inc.public_id,
        "internalId": inc.id,
        "type": inc.type,
        "title": inc.title,
        "description": inc.summary,
        "severity": _SEVERITY_MAP.get((inc.risk_level or "low").upper(), "moderate"),
        "confidenceScore": round(float(inc.confidence_score or 50)),
        "status": _STATUS_TO_FRONTEND.get(inc.status, "monitoring"),
        "riskLevel": (inc.risk_level or "LOW").upper(),
        "riskScore": round(float(inc.risk_score or 0), 1),
        "signalKind": inc.signal_kind or "OBSERVED_EVENT",
        "lat": float(inc.latitude),
        "lng": float(inc.longitude),
        "locationName": inc.location_name or "",
        "district": inc.district or "",
        "state": inc.state or "",
        "affectedRadiusKm": float(inc.affected_radius_km or 25),
        "startedAt": iso(inc.detected_at),
        "updatedAt": iso(inc.updated_at),
        "sources": incident_sources(db, inc, registry),
        "newsDispatches": [],  # F13 social/news ingestion is a V2 non-goal for MVP
        "verificationStatus": _verification_status(inc.verification_status),
        "verificationFactors": incident_verification_factors(inc),
        "whatWeKnow": _loads(inc.what_we_known_json, []),
        "riskFactors": incident_risk_factors(inc, latest_assessment),
        "officialWarnings": _loads(inc.official_warnings_json, []),
        "systemRecommendations": incident_recommendations(db, inc),
        "rainfallMm": float(inc.rainfall_mm) if inc.rainfall_mm is not None else None,
        "magnitude": float(inc.magnitude) if inc.magnitude is not None else None,
        "temperatureC": float(inc.temperature_c) if inc.temperature_c is not None else None,
        "affectedPopulationEstimate": population_estimate,
        "trend": inc.trend or "stable",
        "expiresAt": iso(inc.expires_at),
    }


def serialize_resource(res: Resource, origin_lat: float | None = None,
                       origin_lng: float | None = None) -> dict[str, Any]:
    distance_km = None
    if origin_lat is not None and origin_lng is not None:
        distance_km = round(haversine_km(origin_lat, origin_lng, res.latitude, res.longitude), 2)
    return {
        "id": res.public_id,
        "name": res.name,
        "type": res.type,
        "lat": float(res.latitude),
        "lng": float(res.longitude),
        "address": res.address or "",
        "district": res.district or "",
        "state": res.state or "",
        "phone": res.contact_number or "",
        "capacity": res.capacity,
        "status": _RESOURCE_STATUS_MAP.get((res.availability_status or "OPEN").upper(), "open"),
        "source": res.source_name or "Curated dataset",
        "updatedAt": rel_time(res.last_verified_at or res.created_at),
        "distanceKm": distance_km,
        "availableBedsOrKits": res.available_beds_or_kits,
    }


def serialize_alert(alert: Alert, incident_public_id: str | None = None,
                    incident_type: str | None = None) -> dict[str, Any]:
    sev = (alert.severity or "moderate").lower()
    return {
        "id": alert.public_id,
        "eventId": incident_public_id or "",
        "severity": sev,
        "title": alert.title,
        "message": alert.message,
        "locationName": alert.affected_area or "",
        "createdAt": iso(alert.created_at),
        "read": False,
        "type": incident_type or "flood",
        "recommendedAction": alert.recommended_action or "",
        "source": "Multi-Source Detection Engine",
    }


def serialize_report(rep: CitizenReport) -> dict[str, Any]:
    linked = None
    return {
        "id": rep.public_id,
        "userId": None,
        "userName": rep.user_name or "Anonymous Citizen",
        "eventId": linked,
        "type": rep.type,
        "description": rep.description,
        "lat": float(rep.latitude),
        "lng": float(rep.longitude),
        "locationName": rep.location_name or "",
        "mediaUrl": rep.media_url,
        "verificationStatus": _verification_status(rep.verification_status),
        "confidenceScore": round(float(rep.confidence_score or 50)),
        "createdAt": iso(rep.created_at),
        "updatedAt": iso(rep.updated_at),
        "upvotes": int(rep.upvotes or 0),
        "evidenceNotes": rep.evidence_notes,
    }


def serialize_weather(obs: WeatherObservation | None, is_stale: bool = False) -> dict[str, Any]:
    if obs is None:
        return {
            "location": None, "latitude": None, "longitude": None,
            "timestamp": None, "observedAt": None, "isStale": True,
            "temperature": None, "rainfallMm1h": None, "rainfallMm24h": None,
            "windKmh": None, "weatherCondition": None, "warningLevel": None,
            "provider": None, "message": "No weather observation available yet",
        }
    return {
        "location": obs.location_name,
        "latitude": obs.latitude,
        "longitude": obs.longitude,
        "timestamp": iso(obs.observed_at),
        "observedAt": iso(obs.observed_at),
        "updatedAt": iso(obs.created_at),
        "isStale": is_stale,
        "temperature": obs.temperature_c,
        "rainfallMm1h": obs.rainfall_mm_1h,
        "rainfallMm24h": obs.rainfall_mm_24h,
        "windKmh": obs.wind_kmh,
        "weatherCondition": obs.condition,
        "warningLevel": obs.warning_level,
        "provider": "open_meteo",
    }


def serialize_earthquake(q) -> dict[str, Any]:
    return {
        "externalEventId": q.external_event_id,
        "magnitude": q.magnitude,
        "latitude": q.latitude,
        "longitude": q.longitude,
        "depthKm": q.depth_km,
        "regionName": q.region_name,
        "occurredAt": iso(q.occurred_at),
        "provider": "usgs_earthquake",
    }


def serialize_recommendation(rec: Recommendation) -> dict[str, Any]:
    return {
        "id": f"REC-{rec.id:03d}",
        "disasterType": rec.disaster_type,
        "severity": _SEVERITY_MAP.get((rec.min_risk_level or "MODERATE").upper(), "moderate"),
        "title": rec.title,
        "description": rec.instruction,
        "priority": rec.priority,
        "sourceCategory": "Official Guidance (NDMA/SDMA)" if rec.is_official else "System Recommendation",
        "isOfficial": bool(rec.is_official),
    }


def serialize_scheme(scheme: GovernmentScheme, matched_hazards: list[dict[str, Any]] | None = None) -> dict[str, Any]:
    out: dict[str, Any] = {
        "id": scheme.scheme_code,
        "name": scheme.name,
        "level": (scheme.level or "CENTRAL").upper(),
        "administeringBody": scheme.administering_body or "",
        "applicableDisasterTypes": _loads(scheme.applicable_disaster_types_json, []),
        "summary": scheme.summary or "",
        "benefitDetails": scheme.benefit_details or "",
        "eligibility": scheme.eligibility or "",
        "documentsRequired": _loads(scheme.documents_required_json, []),
        "howToApply": _loads(scheme.how_to_apply_json, []),
        "portalUrl": scheme.official_portal or "",
        "helpline": scheme.helpline,
    }
    if matched_hazards is not None:
        out["matchedHazards"] = matched_hazards
    return out


def serialize_emergency_contact(contact: EmergencyContact) -> dict[str, Any]:
    return {
        "id": str(contact.id),
        "name": contact.name,
        "category": contact.category,
        "phoneNumber": contact.phone_number,
        "description": contact.description or "",
    }


__all__ = [
    "serialize_source",
    "serialize_incident",
    "serialize_resource",
    "serialize_alert",
    "serialize_report",
    "serialize_weather",
    "serialize_earthquake",
    "serialize_recommendation",
    "serialize_scheme",
    "serialize_emergency_contact",
]
