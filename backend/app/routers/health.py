from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import text
from app.core.database import get_db

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("")
async def health_check(db: AsyncSession = Depends(get_db)):
    try:
        # Check if database is reachable
        await db.execute(text("SELECT 1"))
        return {
            "status": "ok",
            "database": "connected"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database connection error: {str(e)}"
        )
