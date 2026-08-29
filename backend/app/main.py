"""FastAPI application entrypoint — Multi-Source Disaster Intelligence backend."""
from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import settings
from .database import Base, engine

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("disaster-backend")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables (idempotent), then patch any missing columns on pre-existing
    # tables so older demo databases self-heal without manual deletion.
    from . import models  # noqa: F401 - ensure models are imported before create_all
    from .database import run_light_migrations

    Base.metadata.create_all(bind=engine)
    applied = run_light_migrations()
    if applied:
        logger.info("schema upgraded: %s", applied)

    if settings.ENABLE_SCHEDULER:
        from .scheduler import run_initial_pipeline, start_scheduler

        summary = run_initial_pipeline()
        logger.info("startup pipeline summary: %s", summary)
        start_scheduler()
    yield
    from .scheduler import stop_scheduler

    stop_scheduler()


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version="1.0.0",
        description=(
            "Backend for the Multi-Source Disaster Intelligence and Response Support System. "
            "Collects heterogeneous disaster signals, normalizes them, detects incidents, "
            "classifies risk, verifies confidence and serves reliable APIs to the frontend."
        ),
        docs_url="/docs",
        openapi_url="/openapi.json",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    from .api.routes_admin import router as admin_router
    from .api.routes_alerts import router as alerts_router
    from .api.routes_earthquakes import router as quakes_router
    from .api.routes_emergency import router as emergency_router
    from .api.routes_health import router as health_router
    from .api.routes_incidents import router as incidents_router
    from .api.routes_locations import router as locations_router
    from .api.routes_recommendations import router as recs_router
    from .api.routes_reports import router as reports_router
    from .api.routes_resources import router as resources_router
    from .api.routes_schemes import router as schemes_router
    from .api.routes_weather import router as weather_router

    api = settings.API_V1_PREFIX
    app.include_router(health_router, prefix=api)
    app.include_router(locations_router, prefix=api)
    app.include_router(weather_router, prefix=api)
    app.include_router(quakes_router, prefix=api)
    app.include_router(incidents_router, prefix=api)
    app.include_router(resources_router, prefix=api)
    app.include_router(recs_router, prefix=api)
    app.include_router(alerts_router, prefix=api)
    app.include_router(reports_router, prefix=api)
    app.include_router(schemes_router, prefix=api)
    app.include_router(emergency_router, prefix=api)
    app.include_router(admin_router, prefix=f"{api}/admin")

    @app.get("/")
    def root():
        return {
            "service": settings.APP_NAME,
            "docs": "/docs",
            "api": settings.API_V1_PREFIX,
            "health": f"{settings.API_V1_PREFIX}/health",
        }

    # EC8: controlled errors, never leak stack traces
    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        logger.exception("unhandled error on %s %s", request.method, request.url.path)
        return JSONResponse(status_code=503, content={"detail": "Service temporarily unavailable"})

    return app


app = create_app()
