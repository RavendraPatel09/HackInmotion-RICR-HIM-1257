from datetime import datetime, timezone

from fastapi import APIRouter

from app.core.config import get_settings

router = APIRouter()


@router.get("/health", tags=["Health"], summary="Liveness check")
async def health():
    settings = get_settings()
    return {
        "success": True,
        "data": {
            "status": "ok",
            "service": "smartcity-resolve-ai-service",
            "model_version": settings.model_version,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
    }
