from app.core.config import get_settings
from app.schemas.duplicate import (
    DuplicateCheckRequest,
    DuplicateCheckResponse,
    DuplicateMatch,
    IssueRef,
)
from app.utils.geo_utils import haversine_distance_meters
from app.utils.image_utils import fetch_image, hash_similarity, perceptual_hash
from app.utils.text_utils import text_similarity

# Weights for the composite duplicate score (sum to 1.0).
# The Admin API's PostGIS radius query already narrows candidates
# geographically before calling this service, but distance still
# factors into the final score for ranking.
WEIGHTS = {
    "distance": 0.30,
    "category": 0.20,
    "text": 0.30,
    "image": 0.20,
}

CLOSED_STATUSES = {"CLOSED", "RESOLVED"}


def _distance_score(distance_m: float, radius_m: float) -> float:
    if distance_m >= radius_m:
        return 0.0
    return round(1 - (distance_m / radius_m), 4)


def _confidence_bucket(score: float) -> str:
    if score >= 75:
        return "HIGH"
    if score >= 45:
        return "MEDIUM"
    return "LOW"


async def _image_similarity_or_none(target: IssueRef, candidate: IssueRef) -> float | None:
    if not target.image_url or not candidate.image_url:
        return None

    image_a = await fetch_image(str(target.image_url))
    image_b = await fetch_image(str(candidate.image_url))

    if image_a is None or image_b is None:
        return None

    return hash_similarity(perceptual_hash(image_a), perceptual_hash(image_b))


async def find_duplicates(payload: DuplicateCheckRequest) -> DuplicateCheckResponse:
    settings = get_settings()
    matches: list[DuplicateMatch] = []

    for candidate in payload.candidates:
        if candidate.issue_id == payload.target.issue_id:
            continue

        # A duplicate report against an already-closed issue is still
        # useful signal (recurrence), but we down-weight rather than skip.
        recurrence_penalty = 0.85 if candidate.status in CLOSED_STATUSES else 1.0

        distance_m = haversine_distance_meters(
            payload.target.latitude,
            payload.target.longitude,
            candidate.latitude,
            candidate.longitude,
        )

        if distance_m > payload.radius_meters:
            continue

        category_sim = 1.0 if candidate.category == payload.target.category else 0.0
        text_sim = text_similarity(payload.target.description, candidate.description)
        image_sim = await _image_similarity_or_none(payload.target, candidate)

        # Redistribute the image weight into text+category when no image
        # pair is comparable, so the score isn't unfairly deflated.
        if image_sim is None:
            local_weights = {
                "distance": WEIGHTS["distance"],
                "category": WEIGHTS["category"] + WEIGHTS["image"] * 0.4,
                "text": WEIGHTS["text"] + WEIGHTS["image"] * 0.6,
            }
            composite = (
                _distance_score(distance_m, payload.radius_meters) * local_weights["distance"]
                + category_sim * local_weights["category"]
                + text_sim * local_weights["text"]
            )
        else:
            composite = (
                _distance_score(distance_m, payload.radius_meters) * WEIGHTS["distance"]
                + category_sim * WEIGHTS["category"]
                + text_sim * WEIGHTS["text"]
                + image_sim * WEIGHTS["image"]
            )

        score = round(composite * 100 * recurrence_penalty, 2)

        matches.append(
            DuplicateMatch(
                issue_id=candidate.issue_id,
                distance_meters=round(distance_m, 1),
                category_similarity=category_sim,
                text_similarity=round(text_sim, 4),
                image_similarity=image_sim,
                duplicate_score=score,
                confidence=_confidence_bucket(score),
            )
        )

    matches.sort(key=lambda m: m.duplicate_score, reverse=True)

    return DuplicateCheckResponse(
        issue_id=payload.target.issue_id,
        duplicates=matches,
        model_version=settings.model_version,
    )
