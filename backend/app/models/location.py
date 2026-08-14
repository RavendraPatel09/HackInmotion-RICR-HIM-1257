from sqlalchemy import Column, String, Integer, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class State(Base):
    __tablename__ = "states"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    name_hi = Column(String, nullable=True)
    code = Column(String(5), unique=True, nullable=False)

    cities = relationship("City", back_populates="state", cascade="all, delete-orphan")

class City(Base):
    __tablename__ = "cities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    name_hi = Column(String, nullable=True)
    state_id = Column(Integer, ForeignKey("states.id", ondelete="CASCADE"), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)

    state = relationship("State", back_populates="cities")
    wards = relationship("Ward", back_populates="city", cascade="all, delete-orphan")

class Ward(Base):
    __tablename__ = "wards"

    id = Column(String, primary_key=True, index=True)  # e.g. "ward-01"
    name = Column(String, nullable=False)
    name_hi = Column(String, nullable=True)
    city_id = Column(Integer, ForeignKey("cities.id", ondelete="CASCADE"), nullable=False)
    officer_name = Column(String, nullable=True)
    officer_phone = Column(String, nullable=True)
    officer_avatar = Column(String, nullable=True)
    center_lat = Column(Float, nullable=False)
    center_lng = Column(Float, nullable=False)
    color = Column(String(10), nullable=True)
    boundary_box = Column(JSON, nullable=True)  # {nLat, sLat, eLng, wLng}

    city = relationship("City", back_populates="wards")
    users = relationship("User", back_populates="ward")
