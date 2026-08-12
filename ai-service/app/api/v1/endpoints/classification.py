from fastapi import APIRouter, Depends

from app.core.security import verify_api_key
from app.schemas.classification import ClassifyRequest, ClassifyResponse
from app.schemas.common import SuccessResponse
from app.services.classifier_service import classify_issue

router = APIRouter(dependencies=[Depends(verify_api_key)])


@router.post(
    "/classify",
    response_model=SuccessResponse[ClassifyResponse],
    tags=["Classification"],
    summary="Classify a civic issue's category, severity, and safety risk",
)
async def classify(payload: ClassifyRequest):
    result = await classify_issue(payload)
    return SuccessResponse(data=result)
