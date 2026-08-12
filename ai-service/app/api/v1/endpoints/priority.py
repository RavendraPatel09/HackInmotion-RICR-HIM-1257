from fastapi import APIRouter, Depends

from app.core.security import verify_api_key
from app.schemas.common import SuccessResponse
from app.schemas.priority import PrioritySignalsRequest, PrioritySignalsResponse
from app.services.priority_service import compute_priority_signals

router = APIRouter(dependencies=[Depends(verify_api_key)])


@router.post(
    "/priority-signals",
    response_model=SuccessResponse[PrioritySignalsResponse],
    tags=["Priority"],
    summary="Compute severity and safety-risk signals feeding the Admin API's PriorityEngine",
)
async def priority_signals_endpoint(payload: PrioritySignalsRequest):
    result = compute_priority_signals(payload)
    return SuccessResponse(data=result)
