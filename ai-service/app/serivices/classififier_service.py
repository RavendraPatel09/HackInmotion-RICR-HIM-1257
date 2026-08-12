from datetime import datetime, timezone

from app.core.config import get_settings
from app.models.category_keywords import (
    CATEGORY_KEYWORDS,
    DEFAULT_CATEGORY,
    SAFETY_RISK_KEYWORDS,
)
from app.schemas.classification import ClassifyRequest, ClassifyResponse
from app.utils.image_utils import fetch_image
from app.utils.text_utils import extract_matched_keywords, normalize


async def classify_issue(payload: ClassifyRequest) -> ClassifyResponse:
    settings = get_settings()
    normalized_desc = normalize(payload.description)

    # ---- Category classification ----
    best_category = DEFAULT_CATEGORY
    best_matches: list[str] = []
    best_score = 0

    for category, keywords in CATEGORY_KEYWORDS.items():
        matches = extract_matched_keywords(normalized_desc, keywords)
        if len(matches) > best_score:
            best_score = len(matches)
            best_category = category
            best_matches = matches

    # Citizen-provided hint boosts confidence if it agrees with the model
    hint_agrees = bool(
        payload.category_hint and payload.category_hint.upper() == best_category
    )

    if best_score == 0:
        confidence = 0.35 if not payload.category_hint else 0.55
        if payload.category_hint:
            best_category = payload.category_hint.upper()
    else:
        confidence = min(0.6 + best_score * 0.12, 0.97)
        if hint_agrees:
            confidence = min(confidence + 0.05, 0.99)

    # ---- Severity scoring (0-100) ----
    severity = 30 + best_score * 10
    severity = min(severity, 100)

    # ---- Safety risk scoring (0-100) ----
    safety_matches = extract_matched_keywords(normalized_desc, SAFETY_RISK_KEYWORDS)
    safety_risk = min(len(safety_matches) * 25 + (10 if safety_matches else 0), 100)

    # ---- Image evidence check ----
    image_analyzed = False
    if payload.image_url:
        image = await fetch_image(str(payload.image_url))
        if image is not None:
            image_analyzed = True
            # Presence of a decodable, real photo mildly increases confidence
            confidence = min(confidence + 0.03, 0.99)

    return ClassifyResponse(
        issue_id=payload.issue_id,
        category=best_category,
        confidence=round(confidence, 4),
        severity=int(severity),
        safety_risk=int(safety_risk),
        matched_keywords=best_matches,
        image_analyzed=image_analyzed,
        model_version=settings.model_version,
        created_at=datetime.now(timezone.utc),
    )
