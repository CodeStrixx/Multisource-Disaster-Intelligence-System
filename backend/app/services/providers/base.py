"""FR-1.1 Provider adapter interface. Every provider implements this contract."""
from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any


@dataclass
class ProviderResult:
    """Normalized output shared by all providers (FR-1.2 metadata included)."""

    provider_id: str
    ok: bool
    items: list[dict[str, Any]] = field(default_factory=list)
    error: str | None = None
    fetched_at: datetime | None = None
    used_mock: bool = False


class BaseProvider(ABC):
    """fetch_data() -> normalize_data() -> validate_data(); status tracked separately."""

    provider_id: str = "base"

    @abstractmethod
    def fetch_data(self) -> list[dict[str, Any]]:
        ...

    @abstractmethod
    def normalize_data(self, raw: Any) -> list[dict[str, Any]]:
        ...

    def validate_data(self, item: dict[str, Any]) -> bool:
        from ...utils import valid_coords

        return valid_coords(item.get("latitude"), item.get("longitude"))

    def get_provider_status(self) -> dict[str, Any]:
        from ...state import get as state_get

        return state_get(self.provider_id)

    def collect(self) -> ProviderResult:
        """Full pipeline with failure isolation: never raises (EC1/EC9)."""
        from ...state import mark_failure, mark_success

        try:
            raw = self.fetch_data()
            items = [i for i in self.normalize_data(raw) if self.validate_data(i)]
            mark_success(self.provider_id)
            return ProviderResult(self.provider_id, True, items)
        except Exception as exc:  # noqa: BLE001 - isolate any provider failure
            mark_failure(self.provider_id, str(exc))
            return ProviderResult(self.provider_id, False, [], error=str(exc))
