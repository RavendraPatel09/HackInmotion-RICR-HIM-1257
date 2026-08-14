from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.models.report import Report
from app.schemas.report import ReportResponse

router = APIRouter(prefix="/map", tags=["Map"])

@router.get("/reports")
async def get_map_reports(
    city: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    department: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Report)
    
    if city:
        query = query.filter(Report.city == city)
    if category and category != "all":
        query = query.filter(Report.category == category)
    if status and status != "all":
        query = query.filter(Report.status == status)
    if priority and priority != "all":
        query = query.filter(Report.priority == priority)
    if department and department != "all":
        query = query.filter(Report.department == department)
        
    result = await db.execute(query)
    reports = result.scalars().all()
    
    # Return minimal markers information to save bandwidth
    markers = []
    for r in reports:
        markers.append({
            "id": r.id,
            "trackingId": r.tracking_id,
            "title": r.title,
            "category": r.category,
            "status": r.status,
            "priority": r.priority,
            "lat": r.lat,
            "lng": r.lng,
            "address": r.address,
            "photoUrl": r.photo_url
        })
    return markers
