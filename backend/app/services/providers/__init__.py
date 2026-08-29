"""Provider package: every external source implements the common adapter interface (FR-1.1)."""
from .base import BaseProvider, ProviderResult

__all__ = ["BaseProvider", "ProviderResult"]
