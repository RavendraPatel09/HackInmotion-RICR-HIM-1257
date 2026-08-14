from pydantic import BaseModel, EmailStr
from typing import Optional, List

class UserSettingsSchema(BaseModel):
    email_notifications: bool
    push_notifications: bool
    language_preference: str
    accessibility_reduced_motion: bool
    city_preference: str

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str
    phone: Optional[str] = None
    avatar: Optional[str] = None
    ward_id: Optional[str] = None
    department_id: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    avatar: Optional[str] = None
    ward_id: Optional[str] = None
    department_id: Optional[str] = None
    points: Optional[int] = None
    badges: Optional[List[str]] = None

class UserResponse(UserBase):
    id: str
    points: int
    badges: List[str]
    settings: Optional[UserSettingsSchema] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    refresh_token: str
    user: UserResponse
