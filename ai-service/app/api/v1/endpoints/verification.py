from fastapi import APIRouter, Depends

from app.core.security import verify_api_key
from app.schemas.common import SuccessResponse
from app.schemas.verification import VerifyResolutionRequest, VerifyResolutionResponse
from app.services.verification_service import verify_resolution

router = APIRouter(dependencies=[Depends(verify_api_key)])


@router.post(
    "/verify-resolution",
    response_model=SuccessResponse[VerifyResolutionResponse],
    tags=["Verification"],
    summary="Verify resolution evidence (before/after photos) submitted by an admin",
    description=(
        "Returns a recommendation only — APPROVE / MANUAL_REVIEW / REJECT. "
        "The Admin API's human reviewer always has final say; this endpoint "
        "never silently closes an issue."
    ),
)
async def verify_resolution_endpoint(payload: VerifyResolutionRequest):
    result = await verify_resolution(payload)
    return SuccessResponse(data=result)
