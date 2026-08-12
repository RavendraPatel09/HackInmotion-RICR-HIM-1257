from fastapi import APIRouter, Depends

from app.core.security import verify_api_key
from app.schemas.common import SuccessResponse
from app.schemas.similarity import (
    ImageSimilarityRequest,
    ImageSimilarityResponse,
    TextSimilarityRequest,
    TextSimilarityResponse,
)
from app.services.similarity_service import compute_image_similarity, compute_text_similarity

router = APIRouter(dependencies=[Depends(verify_api_key)])


@router.post(
    "/similarity/text",
    response_model=SuccessResponse[TextSimilarityResponse],
    tags=["Similarity"],
    summary="Compute text similarity between two issue descriptions",
)
async def text_similarity_endpoint(payload: TextSimilarityRequest):
    result = compute_text_similarity(payload)
    return SuccessResponse(data=result)


@router.post(
    "/similarity/image",
    response_model=SuccessResponse[ImageSimilarityResponse],
    tags=["Similarity"],
    summary="Compute perceptual similarity between two evidence images",
)
async def image_similarity_endpoint(payload: ImageSimilarityRequest):
    result = await compute_image_similarity(payload)
    return SuccessResponse(data=result)
