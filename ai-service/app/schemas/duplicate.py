from typing import Optional

from pydantic import BaseModel, Field, HttpUrl


class IssueRef(BaseModel):
    issue_id: str
    latitude: float
    longitude: float
    category: str
    description: str
    image_url: Optional[HttpUrl] = None
    status: str
    created_at: str


class DuplicateCheckRequest(BaseModel):
    target: IssueRef = Field(..., description="The newly reported issue")
    candidates: list[IssueRef] = Field(
        ..., description="Nearby open/recent issues fetched by the Admin API via PostGIS radius query"
    )
    radius_meters: float = 300


class DuplicateMatch(BaseModel):
    issue_id: str
    distance_meters: float
    category_similarity: float = Field(..., ge=0, le=1)
    text_similarity: float = Field(..., ge=0, le=1)
    image_similarity: Optional[float] = Field(None, ge=0, le=1)
    duplicate_score: float = Field(..., ge=0, le=100)
    confidence: str  # LOW | MEDIUM | HIGH


class DuplicateCheckResponse(BaseModel):
    issue_id: str
    duplicates: list[DuplicateMatch]
    model_version: str
