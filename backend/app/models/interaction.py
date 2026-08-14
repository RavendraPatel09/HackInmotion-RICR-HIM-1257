from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    type = Column(String(50), nullable=False)  # report_created, status_changed, upvote_received, etc.
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    read = Column(Boolean, default=False)
    issue_id = Column(String, nullable=True)
    tracking_id = Column(String, nullable=True)

    user = relationship("User", back_populates="notifications")

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    rating = Column(Integer, nullable=False)  # 1-5
    message = Column(String, nullable=False)
    category = Column(String(50), nullable=False)  # General Feedback, Feature Request, etc.
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="feedbacks")

class BugReport(Base):
    __tablename__ = "bug_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    page = Column(String, nullable=True)
    browser = Column(String, nullable=True)
    device = Column(String, nullable=True)
    screenshot_url = Column(String, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="bug_reports")
