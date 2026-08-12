from fastapi import APIRouter, Depends

from app.core.security import verify_api_key
from app.schemas.common import SuccessResponse
from app.schemas.duplicate import DuplicateCheckRequest, DuplicateCheckResponse
from app.services.duplicate_service import find_duplicates

router = APIRouter(dependencies=[Depends(verify_api_key)])


@router.post(
    "/duplicate-check",
    response_model=SuccessResponse[DuplicateCheckResponse],
    tags=["Duplicate Detection"],
    summary="Score candidate issues for likely duplication against a target issue",
    description=(
        "The Admin API first narrows candidates geographically via a PostGIS "
        "radius query (ST_DWithin), then sends the target + candidates here "
        "for composite scoring on distance, category, text, and image similarity."
    ),
)
async def duplicate_check(payload: DuplicateCheckRequest):
    result = await find_duplicates(payload)
    return SuccessResponse(data=result)
