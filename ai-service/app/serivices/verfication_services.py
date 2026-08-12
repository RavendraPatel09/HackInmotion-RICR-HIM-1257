from datetime import datetime, timezone

from app.core.config import get_settings
from app.schemas.verification import VerifyResolutionRequest, VerifyResolutionResponse
from app.utils.image_utils import fetch_image, hash_similarity, perceptual_hash
from app.utils.text_utils import text_similarity


async def verify_resolution(payload: VerifyResolutionRequest) -> VerifyResolutionResponse:
    settings = get_settings()

    before = await fetch_image(str(payload.before_image_url))
    after = await fetch_image(str(payload.after_image_url))

    if before is None or after is None:
        return VerifyResolutionResponse(
            issue_id=payload.issue_id,
            likely_resolved=False,
            confidence=0.0,
            image_change_score=0.0,
            notes_relevance=0.0,
            recommendation="MANUAL_REVIEW",
            model_version=settings.model_version,
            created_at=datetime.now(timezone.utc),
        )

    # A resolved issue's before/after photos should look meaningfully
    # DIFFERENT (pothole filled, garbage cleared, light fixed) — so we
    # invert similarity into a "change score".
    visual_similarity = hash_similarity(perceptual_hash(before), perceptual_hash(after))
    image_change_score = round(1 - visual_similarity, 4)

    notes_relevance = 0.5
    if payload.resolution_notes:
        notes_relevance = text_similarity(payload.description, payload.resolution_notes)
        # Even loosely related notes still describe *a* fix; floor it.
        notes_relevance = max(notes_relevance, 0.3)

    # Composite confidence: meaningful visual change + notes that relate
    # to the original complaint.
    confidence = round(min(image_change_score * 0.7 + notes_relevance * 0.3, 0.99), 4)

    if image_change_score < 0.08:
        # Near-identical before/after photos — likely a duplicate/stock photo,
        # or work wasn't actually done. Always route to a human.
        recommendation = "REJECT"
        likely_resolved = False
    elif confidence >= 0.65:
        recommendation = "APPROVE"
        likely_resolved = True
    else:
        recommendation = "MANUAL_REVIEW"
        likely_resolved = False

    return VerifyResolutionResponse(
        issue_id=payload.issue_id,
        likely_resolved=likely_resolved,
        confidence=confidence,
        image_change_score=image_change_score,
        notes_relevance=round(notes_relevance, 4),
        recommendation=recommendation,
        model_version=settings.model_version,
        created_at=datetime.now(timezone.utc),
    )
