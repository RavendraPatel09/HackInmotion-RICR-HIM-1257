from pydantic import BaseModel, Field


class PrioritySignalsRequest(BaseModel):
    issue_id: str
    category: str
    description: str
    upvotes: int = Field(0, ge=0)
    duplicate_count: int = Field(0, ge=0)
    age_hours: float = Field(0, ge=0)
    location_importance: float = Field(
        0.5, ge=0, le=1, description="0-1 score for how sensitive the area is (school, hospital, main road...)"
    )


class PrioritySignalsResponse(BaseModel):
    issue_id: str
    severity: int = Field(..., ge=0, le=100)
    safety_risk: int = Field(..., ge=0, le=100)
    recommended_priority: str  # LOW | MEDIUM | HIGH | CRITICAL
    model_version: str
