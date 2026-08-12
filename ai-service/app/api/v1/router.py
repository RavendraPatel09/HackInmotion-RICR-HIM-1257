from fastapi import APIRouter

from app.api.v1.endpoints import classification, duplicate, health, priority, similarity, verification

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(classification.router)
api_router.include_router(similarity.router)
api_router.include_router(duplicate.router)
api_router.include_router(verification.router)
api_router.include_router(priority.router)
