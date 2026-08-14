from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.interaction import Feedback, BugReport
from app.schemas.interaction import FeedbackCreate, BugReportCreate

router = APIRouter(prefix="", tags=["Feedback"])

@router.post("/feedback", status_code=status.HTTP_201_CREATED)
async def submit_feedback(
    feedback_in: FeedbackCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    db_feedback = Feedback(
        user_id=current_user.id,
        rating=feedback_in.rating,
        message=feedback_in.message,
        category=feedback_in.category
    )
    db.add(db_feedback)
    await db.commit()
    return {"status": "success", "message": "Feedback submitted successfully."}

@router.post("/bug-report", status_code=status.HTTP_201_CREATED)
async def submit_bug_report(
    bug_in: BugReportCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    db_bug = BugReport(
        user_id=current_user.id,
        title=bug_in.title,
        description=bug_in.description,
        page=bug_in.page,
        browser=bug_in.browser,
        device=bug_in.device,
        screenshot_url=bug_in.screenshot_url
    )
    db.add(db_bug)
    await db.commit()
    return {"status": "success", "message": "Bug report filed successfully."}
