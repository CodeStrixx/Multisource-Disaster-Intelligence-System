"""APScheduler background jobs (G1 pipeline cadence per PRD F2/F3 refresh intervals)."""
from __future__ import annotations

import logging

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger

from .config import settings

logger = logging.getLogger("scheduler")

_scheduler: BackgroundScheduler | None = None


def _job_weather() -> None:
    from .database import SessionLocal
    from .services.ingestion import ingest_weather

    with SessionLocal() as db:
        try:
            result = ingest_weather(db)
            logger.info("weather ingestion: %s", result)
        except Exception:  # noqa: BLE001
            logger.exception("weather ingestion failed")


def _job_earthquakes() -> None:
    from .database import SessionLocal
    from .services.ingestion import ingest_earthquakes

    with SessionLocal() as db:
        try:
            result = ingest_earthquakes(db)
            logger.info("earthquake ingestion: %s", result)
        except Exception:  # noqa: BLE001
            logger.exception("earthquake ingestion failed")


def _job_detect_and_alert() -> None:
    from .database import SessionLocal
    from .services import alerts as alerts_svc
    from .services.detection import (
        cluster_candidates,
        detect_from_earthquakes,
        detect_from_forecasts,
        detect_from_weather,
    )
    from .services.incident_engine import apply_candidate, expire_incidents

    with SessionLocal() as db:
        try:
            candidates = cluster_candidates(
                detect_from_weather(db) + detect_from_forecasts(db) + detect_from_earthquakes(db)
            )
            alerts = 0
            for cand in candidates:
                inc, _created = apply_candidate(db, cand)
                alerts += len(alerts_svc.generate_alerts_for_incident(db, inc))
            expired = expire_incidents(db)
            db.commit()
            logger.info("detect+alert: candidates=%s alerts=%s expired=%s", len(candidates), alerts, expired)
        except Exception:  # noqa: BLE001
            logger.exception("detect+alert failed")


def start_scheduler() -> BackgroundScheduler | None:
    global _scheduler
    if not settings.ENABLE_SCHEDULER:
        logger.info("scheduler disabled via ENABLE_SCHEDULER=false")
        return None
    if _scheduler is not None:
        return _scheduler

    _scheduler = BackgroundScheduler(timezone="UTC")
    _scheduler.add_job(_job_weather, IntervalTrigger(minutes=settings.WEATHER_REFRESH_MINUTES), id="ingest_weather", max_instances=1, coalesce=True)
    _scheduler.add_job(_job_earthquakes, IntervalTrigger(minutes=settings.EARTHQUAKE_REFRESH_MINUTES), id="ingest_quakes", max_instances=1, coalesce=True)
    _scheduler.add_job(_job_detect_and_alert, IntervalTrigger(minutes=settings.DETECTION_INTERVAL_MINUTES), id="detect_alert", max_instances=1, coalesce=True)
    _scheduler.start()
    logger.info("scheduler started")
    return _scheduler


def run_initial_pipeline() -> dict:
    """Run one full pipeline pass at startup so the API serves fresh data immediately."""
    from .database import SessionLocal
    from .seed import seed_if_empty
    from .services.pipeline import run_full_pipeline

    with SessionLocal() as db:
        counts = seed_if_empty(db)
        try:
            summary = run_full_pipeline(db)
        except Exception as exc:  # noqa: BLE001 — demo resilience (M8)
            logger.exception("initial pipeline failed: %s", exc)
            summary = {"error": str(exc)}
        return {"seed": counts, "pipeline": summary}


def stop_scheduler() -> None:
    global _scheduler
    if _scheduler is not None:
        _scheduler.shutdown(wait=False)
        _scheduler = None
