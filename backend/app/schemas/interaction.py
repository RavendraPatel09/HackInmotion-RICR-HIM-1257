from pydantic import BaseModel, Field
from typing import Optional

class NotificationResponse(BaseModel):
    id: str
    title: str
    message: str
    type: str
    timestamp: str
    read: bool
    issueId: Optional[str] = Field(None, alias="issue_id")
    trackingId: Optional[str] = Field(None, alias="tracking_id")

    class Config:
        populate_by_name = True
        from_attributes = True

class FeedbackCreate(BaseModel):
    rating: int
    message: str
    category: str

class BugReportCreate(BaseModel):
    title: str
    description: str
    page: Optional[str] = None
    browser: Optional[str] = None
    device: Optional[str] = None
    screenshot_url: Optional[str] = None
