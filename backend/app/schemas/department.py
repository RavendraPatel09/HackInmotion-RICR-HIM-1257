from pydantic import BaseModel
from typing import Optional

class CategorySchema(BaseModel):
    id: str
    label: str
    label_hi: Optional[str] = None
    icon_name: Optional[str] = None
    department_id: str
    description: Optional[str] = None
    description_hi: Optional[str] = None
    color: Optional[str] = None
    bg_gradient: Optional[str] = None

    class Config:
        from_attributes = True

class DepartmentSchema(BaseModel):
    id: str
    name: str
    name_hi: Optional[str] = None
    active_issue_count: int
    avg_resolution_time: float
    transparency_score: float
    grade: str

    class Config:
        from_attributes = True

class DepartmentTransparencySchema(BaseModel):
    departmentId: str
    departmentName: str
    totalIssues: int
    resolvedIssues: int
    verifiedIssues: int
    escalatedIssues: int
    resolutionRate: float
    avgResolutionHours: float
    transparencyScore: float
    grade: str
    gradeDescription: str
    escalationRate: float
    verifiedPercentage: float
    avgSatisfaction: Optional[float] = None
