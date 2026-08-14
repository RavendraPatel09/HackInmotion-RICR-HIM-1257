from pydantic import BaseModel
from typing import Optional, Any

class WardSchema(BaseModel):
    id: str
    name: str
    name_hi: Optional[str] = None
    officer_name: Optional[str] = None
    officer_phone: Optional[str] = None
    officer_avatar: Optional[str] = None
    center_lat: float
    center_lng: float
    color: Optional[str] = None
    boundary_box: Optional[Any] = None

    class Config:
        from_attributes = True

class CitySchema(BaseModel):
    id: int
    name: str
    name_hi: Optional[str] = None
    state_id: int
    lat: float
    lng: float

    class Config:
        from_attributes = True

class StateSchema(BaseModel):
    id: int
    name: str
    name_hi: Optional[str] = None
    code: str

    class Config:
        from_attributes = True
