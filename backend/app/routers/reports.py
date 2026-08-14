import uuid
import random
import string
import math
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.report import Report, StatusHistoryItem, ReportComment, ReportVote, SavedReport
from app.models.department import Category, Department
from app.models.interaction import Notification
from app.schemas.report import ReportCreate, ReportResponse, ReportUpdate, ReportCommentSchema, FeedbackRatingCreate

router = APIRouter(prefix="/reports", tags=["Reports"])

def generate_tracking_id() -> str:
    year = datetime.now().year
    chars = "".join(random.choices(string.ascii_uppercase, k=3))
    digits = "".join(random.choices(string.digits, k=3))
    return f"NGR-{year}-{chars}{digits}"

# Convert DB model to Response Schema
def to_report_response(report: Report) -> dict:
    comments = []
    for c in (report.comments or []):
        comments.append({
            "id": c.id,
            "issue_id": c.report_id,
            "author_id": c.author_id,
            "author_name": c.author_name,
            "author_role": c.author_role,
            "text": c.text,
            "created_at": c.created_at.isoformat() if c.created_at else ""
        })

    history = []
    for h in (report.status_history or []):
        history.append({
            "status": h.status,
            "timestamp": h.timestamp.isoformat() if h.timestamp else "",
            "note": h.note,
            "updated_by": h.updated_by,
            "photo_url": h.photo_url
        })

    votes = [v.user_id for v in (report.votes_list or [])]

    return {
        "id": report.id,
        "trackingId": report.tracking_id,
        "title": report.title,
        "description": report.description,
        "category": report.category,
        "department": report.department,
        "status": report.status,
        "priority": report.priority,
        "lat": report.lat,
        "lng": report.lng,
        "address": report.address,
        "state": report.state,
        "district": report.district,
        "city": report.city,
        "wardId": report.ward_id,
        "wardName": report.ward_name,
        "photoUrl": report.photo_url,
        "resolutionPhotoUrl": report.resolution_photo_url,
        "resolutionNotes": report.resolution_notes,
        "reportedBy": report.reporter.name if report.reporter else "Citizen User",
        "reportedAt": report.reported_at.isoformat() if report.reported_at else "",
        "updatedAt": report.updated_at.isoformat() if report.updated_at else "",
        "upvotes": len(votes),
        "upvotedBy": votes,
        "isDuplicateOf": report.is_duplicate_of,
        "escalated": report.escalated,
        "language": report.language,
        "assignedTo": report.assigned_to,
        "assignedAt": report.assigned_at.isoformat() if report.assigned_at else None,
        "comments": comments,
        "statusHistory": history,
        "satisfactionRating": report.satisfaction_rating,
        "satisfactionComment": report.satisfaction_comment,
        "isAnonymous": report.is_anonymous
    }

@router.get("", response_model=List[ReportResponse])
async def list_reports(
    category: Optional[str] = None,
    status: Optional[str] = None,
    department: Optional[str] = None,
    priority: Optional[str] = None,
    city: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Report).options(
        selectinload(Report.comments),
        selectinload(Report.status_history),
        selectinload(Report.votes_list),
        selectinload(Report.reporter)
    )

    if category and category != "all":
        query = query.filter(Report.category == category)
    if status and status != "all":
        query = query.filter(Report.status == status)
    if department and department != "all":
        query = query.filter(Report.department == department)
    if priority and priority != "all":
        query = query.filter(Report.priority == priority)
    if city:
        query = query.filter(Report.city == city)

    result = await db.execute(query)
    reports = result.scalars().all()
    return [to_report_response(r) for r in reports]

def calculate_distance_meters(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    R = 6371000.0  # Earth radius in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lng2 - lng1)
    
    a = math.sin(delta_phi / 2.0)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0)**2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def create_report(
    report_in: ReportCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Lookup Category to find Department automatically (database driven)
    cat_result = await db.execute(select(Category).filter(Category.id == report_in.category))
    cat = cat_result.scalars().first()
    if not cat:
        raise HTTPException(status_code=400, detail="Invalid issue category selected.")
    
    # Backend Duplicate Detection
    recent_reports_query = select(Report).filter(
        Report.category == report_in.category,
        Report.status.notin_(["Resolved", "Verified"])
    )
    res = await db.execute(recent_reports_query)
    recent_reports = res.scalars().all()
    
    is_duplicate_of = None
    for r in recent_reports:
        reported_at = r.reported_at
        if reported_at.tzinfo is None:
            now_compare = datetime.now()
        else:
            now_compare = datetime.now(timezone.utc)
            
        if now_compare - reported_at > timedelta(days=14):
            continue
            
        dist = calculate_distance_meters(report_in.lat, report_in.lng, r.lat, r.lng)
        if dist <= 150.0:
            is_duplicate_of = r.id
            break

    report_id = f"iss-{uuid.uuid4().hex[:8]}"
    tracking_id = generate_tracking_id()
    
    db_report = Report(
        id=report_id,
        tracking_id=tracking_id,
        title=report_in.title,
        description=report_in.description,
        category=report_in.category,
        department=cat.department_id,
        status="Reported",
        priority=report_in.priority,
        lat=report_in.lat,
        lng=report_in.lng,
        address=report_in.address,
        state=report_in.state,
        district=report_in.district,
        city=report_in.city,
        ward_id=report_in.wardId,
        ward_name=report_in.wardName,
        photo_url=report_in.photoUrl,
        reported_by=current_user.id,
        is_duplicate_of=is_duplicate_of,
        is_anonymous=report_in.isAnonymous or False,
        language="en"
    )
    db.add(db_report)

    # Initial history record
    db_history = StatusHistoryItem(
        report_id=report_id,
        status="Reported",
        note="Issue filed and routed.",
        updated_by=current_user.name
    )
    db.add(db_history)

    # Auto notification
    notif_id = f"notif-{uuid.uuid4().hex[:8]}"
    db_notif = Notification(
        id=notif_id,
        user_id=current_user.id,
        title="Issue Report Created",
        message=f"Your report {tracking_id} ({report_in.title}) has been submitted and auto-routed.",
        type="report_created",
        issue_id=report_id,
        tracking_id=tracking_id
    )
    db.add(db_notif)

    await db.commit()
    
    # Reload report with relationships
    stmt = select(Report).filter(Report.id == report_id).options(
        selectinload(Report.comments),
        selectinload(Report.status_history),
        selectinload(Report.votes_list),
        selectinload(Report.reporter)
    )
    result = await db.execute(stmt)
    report = result.scalars().first()

    return to_report_response(report)

@router.get("/track/{tracking_id}", response_model=ReportResponse)
async def track_report(tracking_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Report).filter(Report.tracking_id == tracking_id).options(
        selectinload(Report.comments),
        selectinload(Report.status_history),
        selectinload(Report.votes_list),
        selectinload(Report.reporter)
    )
    result = await db.execute(stmt)
    report = result.scalars().first()
    if not report:
        raise HTTPException(status_code=404, detail="Issue tracking ID not found.")
    return to_report_response(report)

@router.get("/{report_id}", response_model=ReportResponse)
async def get_report(report_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Report).filter(Report.id == report_id).options(
        selectinload(Report.comments),
        selectinload(Report.status_history),
        selectinload(Report.votes_list),
        selectinload(Report.reporter)
    )
    result = await db.execute(stmt)
    report = result.scalars().first()
    if not report:
        raise HTTPException(status_code=404, detail="Issue not found.")
    return to_report_response(report)

@router.post("/{report_id}/vote", response_model=ReportResponse)
async def vote_report(
    report_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Report).filter(Report.id == report_id).options(
        selectinload(Report.votes_list),
        selectinload(Report.status_history),
        selectinload(Report.comments),
        selectinload(Report.reporter)
    )
    result = await db.execute(stmt)
    report = result.scalars().first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found.")

    # Check if user already voted
    vote_stmt = select(ReportVote).filter(ReportVote.report_id == report_id, ReportVote.user_id == current_user.id)
    vote_res = await db.execute(vote_stmt)
    existing_vote = vote_res.scalars().first()

    if existing_vote:
        raise HTTPException(status_code=400, detail="You have already upvoted this report.")

    db_vote = ReportVote(report_id=report_id, user_id=current_user.id)
    db.add(db_vote)

    # Notify issue reporter
    notif_id = f"notif-{uuid.uuid4().hex[:8]}"
    db_notif = Notification(
        id=notif_id,
        user_id=report.reported_by,
        title="Community Priority Boost",
        message=f"Your report {report.tracking_id} received an upvote from a citizen.",
        type="upvote_received",
        issue_id=report.id,
        tracking_id=report.tracking_id
    )
    db.add(db_notif)

    await db.commit()
    db.expire(report)
    
    # Reload report
    result = await db.execute(stmt)
    report = result.scalars().first()
    return to_report_response(report)

@router.delete("/{report_id}/vote", response_model=ReportResponse)
async def remove_vote_report(
    report_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Report).filter(Report.id == report_id).options(
        selectinload(Report.votes_list),
        selectinload(Report.status_history),
        selectinload(Report.comments),
        selectinload(Report.reporter)
    )
    result = await db.execute(stmt)
    report = result.scalars().first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found.")

    vote_stmt = select(ReportVote).filter(ReportVote.report_id == report_id, ReportVote.user_id == current_user.id)
    vote_res = await db.execute(vote_stmt)
    existing_vote = vote_res.scalars().first()

    if not existing_vote:
        raise HTTPException(status_code=400, detail="You have not upvoted this report.")

    await db.delete(existing_vote)
    await db.commit()
    db.expire(report)
    
    # Reload report
    result = await db.execute(stmt)
    report = result.scalars().first()
    return to_report_response(report)

@router.post("/{report_id}/save")
async def save_report(
    report_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Check if saved already
    stmt = select(SavedReport).filter(SavedReport.report_id == report_id, SavedReport.user_id == current_user.id)
    res = await db.execute(stmt)
    existing = res.scalars().first()

    if existing:
        return {"status": "already_saved"}

    db_save = SavedReport(report_id=report_id, user_id=current_user.id)
    db.add(db_save)
    await db.commit()
    return {"status": "saved"}

@router.delete("/{report_id}/save")
async def unsave_report(
    report_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(SavedReport).filter(SavedReport.report_id == report_id, SavedReport.user_id == current_user.id)
    res = await db.execute(stmt)
    existing = res.scalars().first()

    if not existing:
        return {"status": "not_saved"}

    await db.delete(existing)
    await db.commit()
    return {"status": "unsaved"}

@router.post("/{report_id}/comments", response_model=ReportCommentSchema)
async def add_comment(
    report_id: str,
    comment_in: ReportCommentSchema,  # Note: text only in payload body
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    comment_id = f"com-{uuid.uuid4().hex[:8]}"
    db_comment = ReportComment(
        id=comment_id,
        report_id=report_id,
        author_id=current_user.id,
        author_name=current_user.name,
        author_role=current_user.role,
        text=comment_in.text
    )
    db.add(db_comment)
    await db.commit()
    await db.refresh(db_comment)
    return {
        "id": db_comment.id,
        "issue_id": db_comment.report_id,
        "author_id": db_comment.author_id,
        "author_name": db_comment.author_name,
        "author_role": db_comment.author_role,
        "text": db_comment.text,
        "created_at": db_comment.created_at.isoformat()
    }

@router.get("/{report_id}/comments", response_model=List[ReportCommentSchema])
async def get_comments(report_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(ReportComment).filter(ReportComment.report_id == report_id)
    result = await db.execute(stmt)
    comments = result.scalars().all()
    
    return [{
        "id": c.id,
        "issue_id": c.report_id,
        "author_id": c.author_id,
        "author_name": c.author_name,
        "author_role": c.author_role,
        "text": c.text,
        "created_at": c.created_at.isoformat()
    } for c in comments]

@router.put("/{report_id}/status", response_model=ReportResponse)
async def update_report_status(
    report_id: str,
    status_update: ReportUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Report).filter(Report.id == report_id).options(
        selectinload(Report.status_history),
        selectinload(Report.comments),
        selectinload(Report.votes_list),
        selectinload(Report.reporter)
    )
    result = await db.execute(stmt)
    report = result.scalars().first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found.")

    # Enforce RBAC and status lifecycle transitions
    if current_user.role == "citizen":
        if report.reported_by != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only update reports you filed."
            )
        if status_update.status not in ["Verified", "Reopened"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Citizens are only allowed to verify or reopen their reports."
            )
        if report.status != "Resolved":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You can only verify or reopen resolved reports."
            )
    elif current_user.role in ["admin", "ward-officer"]:
        if status_update.status not in ["Acknowledged", "In Progress", "Resolved", "Closed"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Municipal staff cannot set status to {status_update.status} directly."
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized role."
        )

    old_status = report.status
    report.status = status_update.status
    
    if status_update.resolutionPhotoUrl:
        report.resolution_photo_url = status_update.resolutionPhotoUrl
    if status_update.note:
        report.resolution_notes = status_update.note

    # Track status history
    db_history = StatusHistoryItem(
        report_id=report_id,
        status=status_update.status,
        note=status_update.note or f"Status transitioned from {old_status} to {status_update.status}",
        updated_by=current_user.name,
        photo_url=status_update.resolutionPhotoUrl
    )
    db.add(db_history)

    # Notify reporter
    notif_id = f"notif-{uuid.uuid4().hex[:8]}"
    db_notif = Notification(
        id=notif_id,
        user_id=report.reported_by,
        title=f"Status Updated to {status_update.status}",
        message=f"Report {report.tracking_id} updated by {current_user.name}. Status: {status_update.status}.",
        type="status_changed",
        issue_id=report.id,
        tracking_id=report.tracking_id
    )
    db.add(db_notif)

    await db.commit()
    db.expire(report)
    result = await db.execute(stmt)
    report = result.scalars().first()
    return to_report_response(report)

@router.post("/{report_id}/satisfaction", response_model=ReportResponse)
async def submit_satisfaction(
    report_id: str,
    rating_in: FeedbackRatingCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Report).filter(Report.id == report_id).options(
        selectinload(Report.status_history),
        selectinload(Report.comments),
        selectinload(Report.votes_list),
        selectinload(Report.reporter)
    )
    result = await db.execute(stmt)
    report = result.scalars().first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found.")

    report.satisfaction_rating = rating_in.rating
    report.satisfaction_comment = rating_in.comment
    await db.commit()
    db.expire(report)
    result = await db.execute(stmt)
    report = result.scalars().first()
    return to_report_response(report)
