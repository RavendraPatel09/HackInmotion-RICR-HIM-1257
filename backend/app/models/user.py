from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String(20), default="citizen", nullable=False)  # citizen, admin, ward-officer
    phone = Column(String(20), nullable=True)
    avatar = Column(String, nullable=True)
    points = Column(Integer, default=0)
    badges = Column(JSON, default=list)  # list of badge IDs
    
    ward_id = Column(String, ForeignKey("wards.id", ondelete="SET NULL"), nullable=True)
    department_id = Column(String, ForeignKey("departments.id", ondelete="SET NULL"), nullable=True)
    
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    ward = relationship("Ward", back_populates="users")
    department = relationship("Department", back_populates="users")
    settings = relationship("UserSettings", back_populates="user", uselist=False, cascade="all, delete-orphan")
    reports_filed = relationship("Report", back_populates="reporter", foreign_keys="[Report.reported_by]")
    reports_assigned = relationship("Report", back_populates="assignee", foreign_keys="[Report.assigned_to]")
    votes = relationship("ReportVote", back_populates="user", cascade="all, delete-orphan")
    saved_reports = relationship("SavedReport", back_populates="user", cascade="all, delete-orphan")
    comments = relationship("ReportComment", back_populates="author", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    feedbacks = relationship("Feedback", back_populates="user", cascade="all, delete-orphan")
    bug_reports = relationship("BugReport", back_populates="user", cascade="all, delete-orphan")

class UserSettings(Base):
    __tablename__ = "user_settings"

    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    email_notifications = Column(Boolean, default=True)
    push_notifications = Column(Boolean, default=True)
    language_preference = Column(String(5), default="en")
    accessibility_reduced_motion = Column(Boolean, default=False)
    city_preference = Column(String(50), default="Bhopal")

    user = relationship("User", back_populates="settings")
