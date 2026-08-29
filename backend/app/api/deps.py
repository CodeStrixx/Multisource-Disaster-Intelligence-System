"""Shared FastAPI dependencies."""
from __future__ import annotations

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from ..config import settings
from ..database import get_db


def require_admin_secret(x_admin_secret: str = Header(default="")) -> None:
    """Q6: demo-only moderator protection until real auth exists."""
    if not settings.ADMIN_SECRET or x_admin_secret != settings.ADMIN_SECRET:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or missing X-Admin-Secret")


AdminDep = Depends(require_admin_secret)
DbDep = Depends(get_db)

__all__ = ["get_db", "require_admin_secret", "AdminDep", "DbDep"]
