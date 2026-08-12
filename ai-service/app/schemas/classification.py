from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, HttpUrl


class ClassifyRequest(BaseModel):
    issue_id: str = Field(..., description="Source issue ID, echoed back for traceability")
    description: str = Field(..., min_length=3, description="Citizen-provided issue description")
    image_url: Optional[HttpUrl] = Field(None, description="Photo evidence submitted by citizen")
    category_hint: Optional[str] = Field(
        None, description="Category the citizen selected in the app, if any"
    )


class ClassifyResponse(BaseModel):
    issue_id: str
    category: str
    confidence: float = Field(..., ge=0, le=1)
    severity: int = Field(..., ge=0, le=100, description="0-100 estimated severity")
    safety_risk: int = Field(..., ge=0, le=100, description="0-100 estimated public safety risk")
    matched_keywords: list[str]
    image_analyzed: bool
    model_version: str
    created_at: datetime
