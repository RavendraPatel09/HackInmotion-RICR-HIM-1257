from app.schemas.similarity import (
    ImageSimilarityRequest,
    ImageSimilarityResponse,
    TextSimilarityRequest,
    TextSimilarityResponse,
)
from app.utils.image_utils import fetch_image, hash_similarity, perceptual_hash
from app.utils.text_utils import text_similarity


def compute_text_similarity(payload: TextSimilarityRequest) -> TextSimilarityResponse:
    score = text_similarity(payload.text_a, payload.text_b)
    return TextSimilarityResponse(similarity=round(score, 4))


async def compute_image_similarity(payload: ImageSimilarityRequest) -> ImageSimilarityResponse:
    image_a = await fetch_image(str(payload.image_url_a))
    image_b = await fetch_image(str(payload.image_url_b))

    if image_a is None or image_b is None:
        return ImageSimilarityResponse(
            similarity=None,
            comparable=False,
            reason="One or both images could not be fetched or decoded",
        )

    score = hash_similarity(perceptual_hash(image_a), perceptual_hash(image_b))

    return ImageSimilarityResponse(similarity=score, comparable=True)
