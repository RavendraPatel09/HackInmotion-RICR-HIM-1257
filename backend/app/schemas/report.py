from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime

class StatusHistoryItemSchema(BaseModel):
    status: str
    timestamp: str
    note: Optional[str] = None
    updatedBy: str = Field(..., alias="updated_by")
    photoUrl: Optional[str] = Field(None, alias="photo_url")

    class Config:
        populate_by_name = True
        from_attributes = True

class ReportAttachmentSchema(BaseModel):
    id: int
    url: str
    filename: Optional[str] = None
    uploadedAt: str = Field(..., alias="uploaded_at")

    class Config:
        populate_by_name = True
        from_attributes = True

class ReportCommentSchema(BaseModel):
    id: str
    issueId: str = Field(..., alias="issue_id")
    authorId: str = Field(..., alias="author_id")
    authorName: str = Field(..., alias="author_name")
    authorRole: str = Field(..., alias="author_role")
    text: str
    createdAt: str = Field(..., alias="created_at")

    class Config:
        populate_by_name = True
        from_attributes = True

class ReportCreate(BaseModel):
    title: str
    description: str
    category: str
    priority: str
    lat: float
    lng: float
    address: str
    state: str
    district: str
    city: str
    wardId: Optional[str] = None
    wardName: Optional[str] = None
    photoUrl: Optional[str] = None
    isAnonymous: Optional[bool] = False

class ReportUpdate(BaseModel):
    status: str
    note: Optional[str] = None
    resolutionPhotoUrl: Optional[str] = None

class FeedbackRatingCreate(BaseModel):
    rating: int
    comment: Optional[str] = None

class ReportResponse(BaseModel):
    id: str
    trackingId: str
    title: str
    description: str
    category: str
    department: str
    status: str
    priority: str
    lat: float
    lng: float
    address: str
    state: str
    district: str
    city: str
    wardId: Optional[str] = None
    wardName: Optional[str] = None
    photoUrl: Optional[str] = None
    resolutionPhotoUrl: Optional[str] = None
    resolutionNotes: Optional[str] = None
    reportedBy: str
    reportedAt: str
    updatedAt: str
    upvotes: int
    upvotedBy: List[str]
    isDuplicateOf: Optional[str] = None
    escalated: bool
    language: str
    assignedTo: Optional[str] = None
    assignedAt: Optional[str] = None
    comments: List[ReportCommentSchema] = []
    statusHistory: List[StatusHistoryItemSchema] = []
    satisfactionRating: Optional[int] = None
    satisfactionComment: Optional[str] = None
    isAnonymous: bool

    class Config:
        from_attributes = True
