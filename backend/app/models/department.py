from sqlalchemy import Column, String, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Department(Base):
    __tablename__ = "departments"

    id = Column(String, primary_key=True, index=True)  # e.g., "roads-infra"
    name = Column(String, nullable=False, unique=True)
    name_hi = Column(String, nullable=True)
    
    # These can be computed, but we cache them for performance
    active_issue_count = Column(Integer, default=0)
    avg_resolution_time = Column(Float, default=0.0)  # in hours
    transparency_score = Column(Float, default=100.0)  # 0 to 100
    grade = Column(String(5), default="A")

    categories = relationship("Category", back_populates="department")
    users = relationship("User", back_populates="department")
    reports = relationship("Report", back_populates="department_rel")

class Category(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True, index=True)  # e.g., "roads-potholes"
    label = Column(String, nullable=False)
    label_hi = Column(String, nullable=True)
    icon_name = Column(String, nullable=True)
    department_id = Column(String, ForeignKey("departments.id", ondelete="CASCADE"), nullable=False)
    description = Column(String, nullable=True)
    description_hi = Column(String, nullable=True)
    color = Column(String(20), nullable=True)
    bg_gradient = Column(String(100), nullable=True)

    department = relationship("Department", back_populates="categories")
    reports = relationship("Report", back_populates="category_rel")
