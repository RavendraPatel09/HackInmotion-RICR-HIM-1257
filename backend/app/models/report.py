from sqlalchemy import Column, String, Integer, Float, Boolean, ForeignKey, DateTime, JSON, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(String, primary_key=True, index=True)
    tracking_id = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    category = Column(String, ForeignKey("categories.id", ondelete="RESTRICT"), nullable=False)
    department = Column(String, ForeignKey("departments.id", ondelete="RESTRICT"), nullable=False)
    status = Column(String(30), default="Reported", nullable=False)  # Reported, Acknowledged, In Progress, Resolved, Verified, Reopened
    priority = Column(String(20), default="Medium", nullable=False)  # Low, Medium, High, Critical
    
    # Location details
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    address = Column(String, nullable=False)
    state = Column(String(50), nullable=False)
    district = Column(String(50), nullable=False)
    city = Column(String(50), nullable=False)
    ward_id = Column(String, ForeignKey("wards.id", ondelete="SET NULL"), nullable=True)
    ward_name = Column(String, nullable=True)

    # Photos
    photo_url = Column(String, nullable=True)
    resolution_photo_url = Column(String, nullable=True)
    resolution_notes = Column(String, nullable=True)

    # Reporting Details
    reported_by = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    reported_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    upvotes = Column(Integer, default=0)
    is_duplicate_of = Column(String, ForeignKey("reports.id", ondelete="SET NULL"), nullable=True)
    escalated = Column(Boolean, default=False)
    language = Column(String(5), default="en")
    
    # Assignment
    assigned_to = Column(String, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    assigned_at = Column(DateTime(timezone=True), nullable=True)
    
    # Citizen resolution feedback
    satisfaction_rating = Column(Integer, nullable=True)
    satisfaction_comment = Column(String, nullable=True)
    is_anonymous = Column(Boolean, default=False)

    # Relationships
    category_rel = relationship("Category", back_populates="reports")
    department_rel = relationship("Department", back_populates="reports")
    reporter = relationship("User", back_populates="reports_filed", foreign_keys=[reported_by])
    assignee = relationship("User", back_populates="reports_assigned", foreign_keys=[assigned_to])
    
    status_history = relationship("StatusHistoryItem", back_populates="report", cascade="all, delete-orphan")
    attachments = relationship("ReportAttachment", back_populates="report", cascade="all, delete-orphan")
    comments = relationship("ReportComment", back_populates="report", cascade="all, delete-orphan")
    votes_list = relationship("ReportVote", back_populates="report", cascade="all, delete-orphan")
    saved_by = relationship("SavedReport", back_populates="report", cascade="all, delete-orphan")
    escalations = relationship("Escalation", back_populates="report", cascade="all, delete-orphan")

class StatusHistoryItem(Base):
    __tablename__ = "report_status_history"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(String, ForeignKey("reports.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(30), nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    note = Column(String, nullable=True)
    updated_by = Column(String, nullable=False)  # User's name or ID
    photo_url = Column(String, nullable=True)

    report = relationship("Report", back_populates="status_history")

class ReportAttachment(Base):
    __tablename__ = "report_attachments"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(String, ForeignKey("reports.id", ondelete="CASCADE"), nullable=False)
    url = Column(String, nullable=False)
    filename = Column(String, nullable=True)
    file_size = Column(Integer, nullable=True)
    content_type = Column(String(50), nullable=True)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    report = relationship("Report", back_populates="attachments")

class ReportComment(Base):
    __tablename__ = "report_comments"

    id = Column(String, primary_key=True, index=True)
    report_id = Column(String, ForeignKey("reports.id", ondelete="CASCADE"), nullable=False)
    author_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    author_name = Column(String, nullable=False)
    author_role = Column(String(20), nullable=False)
    text = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    report = relationship("Report", back_populates="comments")
    author = relationship("User", back_populates="comments")

class ReportVote(Base):
    __tablename__ = "report_votes"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(String, ForeignKey("reports.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    report = relationship("Report", back_populates="votes_list")
    user = relationship("User", back_populates="votes")

    __table_args__ = (
        UniqueConstraint("report_id", "user_id", name="uq_report_vote_user"),
    )

class SavedReport(Base):
    __tablename__ = "saved_reports"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(String, ForeignKey("reports.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    report = relationship("Report", back_populates="saved_by")
    user = relationship("User", back_populates="saved_reports")

    __table_args__ = (
        UniqueConstraint("report_id", "user_id", name="uq_saved_report_user"),
    )

class Escalation(Base):
    __tablename__ = "escalations"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(String, ForeignKey("reports.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(30), default="Escalated")
    breach_time = Column(DateTime(timezone=True), nullable=False)
    escalated_at = Column(DateTime(timezone=True), server_default=func.now())
    reason = Column(String, nullable=True)

    report = relationship("Report", back_populates="escalations")
