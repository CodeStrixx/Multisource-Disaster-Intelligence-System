"""End-to-end pipeline run: ingest -> detect -> classify -> incidents -> alerts -> expiry (G1)."""
from __future__ import annotations

from typing import Any

from sqlalchemy.orm import Session

from . import alerts as alerts_svc
from . import ingestion
from .detection import (
    cluster_candidates,
    detect_from_earthquakes,
    detect_from_forecasts,
    detect_from_weather,
)
from .incident_engine import apply_candidate, expire_incidents


def run_full_pipeline(db: Session) -> dict[str, Any]:
    wx = ingestion.ingest_weather(db)
    eq = ingestion.ingest_earthquakes(db)

    candidates = detect_from_weather(db) + detect_from_forecasts(db) + detect_from_earthquakes(db)
    candidates = cluster_candidates(candidates)

    created_ids, updated_count, alert_count = [], 0, 0
    for cand in candidates:
        inc, was_created = apply_candidate(db, cand)
        if was_created:
            created_ids.append(inc.public_id)
        else:
            updated_count += 1
        for _ in alerts_svc.generate_alerts_for_incident(db, inc):
            alert_count += 1

    expired = expire_incidents(db)
    db.commit()

    return {
        "weather": wx,
        "earthquakes": eq,
        "candidates_detected": len(candidates),
        "incidents_created": len(created_ids),
        "created_public_ids": created_ids,
        "incidents_updated": updated_count,
        "alerts_generated": alert_count,
        "incidents_expired": expired,
    }


def run_detection_only(db: Session) -> dict[str, Any]:
    """Detection without re-ingestion (cheap; used right after manual triggers)."""
    candidates = cluster_candidates(
        detect_from_weather(db) + detect_from_forecasts(db) + detect_from_earthquakes(db)
    )
    created, updated = [], 0
    for cand in candidates:
        inc, was_created = apply_candidate(db, cand)
        if was_created:
            created.append(inc.public_id)
        else:
            updated += 1
        alerts_svc.generate_alerts_for_incident(db, inc)
    expired = expire_incidents(db)
    db.commit()
    return {
        "incidents_created": len(created),
        "created_public_ids": created,
        "incidents_updated": updated,
        "alerts_and_incidents_expired": expired,
    }


__all__ = ["run_full_pipeline", "run_detection_only"]
