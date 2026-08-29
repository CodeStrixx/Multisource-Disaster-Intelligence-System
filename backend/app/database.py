"""SQLAlchemy engine/session setup. Works with SQLite locally and Postgres/Supabase in the cloud."""
from __future__ import annotations

import logging
from collections.abc import Generator

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from .config import settings

logger = logging.getLogger("database")


class Base(DeclarativeBase):
    pass


_connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=_connect_args,
    pool_pre_ping=True,
    future=True,
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_database() -> bool:
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False


def run_light_migrations() -> list[str]:
    """Add ORM columns missing from an existing schema.

    Base.metadata.create_all() creates missing TABLES but never alters existing
    ones, so deployments made before a model change keep failing on INSERT.
    This adds any missing columns (nullable additions only — safe for SQLite).
    """
    applied: list[str] = []
    insp = inspect(engine)
    for table in Base.metadata.sorted_tables:
        if not insp.has_table(table.name):
            continue  # create_all handles brand-new tables
        existing = {c["name"] for c in insp.get_columns(table.name)}
        for col in table.columns:
            if col.name in existing:
                continue
            if not col.nullable and col.server_default is None:
                logger.warning("skip non-nullable column %s.%s (needs manual migration)", table.name, col.name)
                continue
            col_type = col.type.compile(engine.dialect)
            stmt = f'ALTER TABLE {table.name} ADD COLUMN {col.name} {col_type}'
            with engine.begin() as conn:
                conn.exec_driver_sql(stmt)
            applied.append(f"{table.name}.{col.name}")
    if applied:
        logger.info("light migrations applied: %s", applied)
    return applied
