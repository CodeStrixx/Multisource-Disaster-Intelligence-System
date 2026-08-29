"""F11: health + source monitoring endpoints."""
from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import check_database, get_db
from ..models import DataSource
from ..state import snapshot as provider_snapshot

router = APIRouter(tags=["health"])


@router.get("/health")
def health(db: Session = Depends(get_db)) -> dict[str, Any]:
    db_ok = check_database()
    providers = {}
    for pid, st in provider_snapshot().items():
        providers[pid] = st.get("status", "unknown")
    # include registered-but-never-run sources
    for ds in db.scalars(select(DataSource)).all():
        if ds.provider_id not in providers:
            providers[ds.provider_id] = "idle"
    overall = "healthy" if db_ok else "degraded"
    if providers and all(s in ("failing",) for s in providers.values()):
        overall = "degraded"
    return {
        "status": overall,
        "database": "connected" if db_ok else "unavailable",
        "providers": providers,
        "version": "1.0.0",
    }


@router.get("/sources")
def list_sources(db: Session = Depends(get_db)) -> list[dict[str, Any]]:
    from ..serializers import serialize_source

    rows = db.scalars(select(DataSource).order_by(DataSource.id)).all()
    return [serialize_source(r) for r in rows]


@router.get("/sources/status")
def sources_status() -> dict[str, Any]:
    return {"providers": provider_snapshot()}
