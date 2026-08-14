from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.interaction import Notification
from app.schemas.interaction import NotificationResponse

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("", response_model=List[NotificationResponse])
async def list_notifications(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Notification).filter(Notification.user_id == current_user.id).order_by(Notification.timestamp.desc())
    result = await db.execute(stmt)
    notifications = result.scalars().all()
    
    # Map to schemas manually to allow camelCase translation
    res = []
    for n in notifications:
        res.append(NotificationResponse(
            id=n.id,
            title=n.title,
            message=n.message,
            type=n.type,
            timestamp=n.timestamp.isoformat() if n.timestamp else "",
            read=n.read,
            issue_id=n.issue_id,
            tracking_id=n.tracking_id
        ))
    return res

@router.patch("/{id}/read", response_model=NotificationResponse)
async def read_notification(
    id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Notification).filter(Notification.id == id, Notification.user_id == current_user.id)
    result = await db.execute(stmt)
    notif = result.scalars().first()
    
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found.")
        
    notif.read = True
    await db.commit()
    await db.refresh(notif)
    
    return NotificationResponse(
        id=notif.id,
        title=notif.title,
        message=notif.message,
        type=notif.type,
        timestamp=notif.timestamp.isoformat() if notif.timestamp else "",
        read=notif.read,
        issue_id=notif.issue_id,
        tracking_id=notif.tracking_id
    )

@router.patch("/read-all")
async def read_all_notifications(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Notification).filter(Notification.user_id == current_user.id, Notification.read == False)
    result = await db.execute(stmt)
    notifications = result.scalars().all()
    
    for n in notifications:
        n.read = True
        
    await db.commit()
    return {"status": "success", "count": len(notifications)}

@router.delete("/clear-all")
async def clear_all_notifications(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Notification).filter(Notification.user_id == current_user.id)
    result = await db.execute(stmt)
    notifications = result.scalars().all()
    
    for n in notifications:
        await db.delete(n)
        
    await db.commit()
    return {"status": "success"}
