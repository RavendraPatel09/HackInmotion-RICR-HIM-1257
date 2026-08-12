from typing import Generic, Optional, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class SuccessResponse(BaseModel, Generic[T]):
    success: bool = True
    data: T
    meta: Optional[dict] = None


class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[list] = None


class ErrorResponse(BaseModel):
    success: bool = False
    error: ErrorDetail
