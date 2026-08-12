from app.core.config import get_settings
from app.models.category_keywords import SAFETY_RISK_KEYWORDS
from app.schemas.priority import PrioritySignalsRequest, PrioritySignalsResponse
from app.utils.text_utils import extract_matched_keywords, normalize

# This service produces the raw AI *signals* (severity, safety risk).
# Final priority scoring (combining these with upvotes, SLA urgency,
# recurrence, etc.) stays in the NestJS PriorityEngine — this endpoint
# gives it the two inputs that genuinely require text/NLP analysis.

CATEGORY_BASE_SEVERITY = {
    "ELECTRICITY": 55,
    "DRAINAGE": 50,
    "WATER": 45,
    "ROADS": 40,
    "SANITATION": 35,
    "TRAFFIC": 40,
    "PUBLIC_WORKS": 30,
}


def compute_priority_signals(payload: PrioritySignalsRequest) -> PrioritySignalsResponse:
    settings = get_settings()
    normalized_desc = normalize(payload.description)

    base_severity = CATEGORY_BASE_SEVERITY.get(payload.category.upper(), 30)
    engagement_boost = min(payload.upvotes * 1.5 + payload.duplicate_count * 4, 25)
    age_boost = min(payload.age_hours / 4, 15)

    severity = int(min(base_severity + engagement_boost + age_boost, 100))

    safety_matches = extract_matched_keywords(normalized_desc, SAFETY_RISK_KEYWORDS)
    safety_risk = int(
        min(len(safety_matches) * 25 + payload.location_importance * 20, 100)
    )

    composite = severity * 0.5 + safety_risk * 0.5

    if composite >= 80 or safety_risk >= 75:
        recommended_priority = "CRITICAL"
    elif composite >= 60:
        recommended_priority = "HIGH"
    elif composite >= 35:
        recommended_priority = "MEDIUM"
    else:
        recommended_priority = "LOW"

    return PrioritySignalsResponse(
        issue_id=payload.issue_id,
        severity=severity,
        safety_risk=safety_risk,
        recommended_priority=recommended_priority,
        model_version=settings.model_version,
    )
