from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, HttpUrl


class VerifyResolutionRequest(BaseModel):
    issue_id: str
    description: str = Field(..., description="Original issue description")
    before_image_url: HttpUrl = Field(..., description="Photo submitted by citizen at report time")
    after_image_url: HttpUrl = Field(..., description="Resolution evidence photo submitted by admin")
    resolution_notes: Optional[str] = None


class VerifyResolutionResponse(BaseModel):
    issue_id: str
    likely_resolved: bool
    confidence: float = Field(..., ge=0, le=1)
    image_change_score: float = Field(
        ..., ge=0, le=1, description="How different before/after images are; higher suggests real change"
    )
    notes_relevance: float = Field(..., ge=0, le=1)
    recommendation: str  # APPROVE | MANUAL_REVIEW | REJECT
    model_version: str
    created_at: datetime
