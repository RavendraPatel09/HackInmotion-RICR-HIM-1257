from fastapi import Header, HTTPException, status

from app.core.config import get_settings


async def verify_api_key(x_api_key: str = Header(default="")) -> None:
    """
    Internal service-to-service authentication.

    This service is never called directly by citizens or admins —
    only by the trusted NestJS Admin API backend, which attaches
    AI_SERVICE_API_KEY as the X-API-Key header on every request.
    """
    settings = get_settings()

    if not x_api_key or x_api_key != settings.ai_service_api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "code": "UNAUTHORIZED",
                "message": "Missing or invalid X-API-Key header",
            },
        )
