"""Process-wide runtime state for provider health monitoring (F11)."""
from __future__ import annotations

import threading
from datetime import datetime, timezone

_lock = threading.Lock()
_providers: dict[str, dict] = {}


def _blank(provider_id: str) -> dict:
    return {
        "provider_id": provider_id,
        "status": "unknown",       # healthy | degraded | failing | unknown
        "last_success_at": None,
        "last_failure_at": None,
        "last_error": None,
        "consecutive_failures": 0,
        "used_mock_last_run": False,
    }


def register(provider_id: str) -> None:
    with _lock:
        _providers.setdefault(provider_id, _blank(provider_id))


def mark_success(provider_id: str, used_mock: bool = False) -> None:
    with _lock:
        st = _providers.setdefault(provider_id, _blank(provider_id))
        st["status"] = "degraded" if used_mock else "healthy"
        st["last_success_at"] = datetime.now(timezone.utc).isoformat()
        st["consecutive_failures"] = 0
        st["last_error"] = None
        st["used_mock_last_run"] = used_mock


def mark_failure(provider_id: str, error: str) -> None:
    with _lock:
        st = _providers.setdefault(provider_id, _blank(provider_id))
        st["consecutive_failures"] = int(st["consecutive_failures"]) + 1
        st["last_failure_at"] = datetime.now(timezone.utc).isoformat()
        st["last_error"] = error[:500]
        st["status"] = "failing" if st["consecutive_failures"] >= 2 else "degraded"


def snapshot() -> dict[str, dict]:
    with _lock:
        return {pid: dict(st) for pid, st in _providers.items()}


def get(provider_id: str) -> dict:
    with _lock:
        return dict(_providers.get(provider_id, _blank(provider_id)))
