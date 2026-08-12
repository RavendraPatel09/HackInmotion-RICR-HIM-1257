from typing import Optional

from pydantic import BaseModel, Field, HttpUrl


class TextSimilarityRequest(BaseModel):
    text_a: str = Field(..., min_length=1)
    text_b: str = Field(..., min_length=1)


class TextSimilarityResponse(BaseModel):
    similarity: float = Field(..., ge=0, le=1)
    method: str = "tfidf-cosine"


class ImageSimilarityRequest(BaseModel):
    image_url_a: HttpUrl
    image_url_b: HttpUrl


class ImageSimilarityResponse(BaseModel):
    similarity: Optional[float] = Field(None, ge=0, le=1)
    method: str = "perceptual-hash"
    comparable: bool = Field(
        ..., description="False if one or both images could not be fetched/decoded"
    )
    reason: Optional[str] = None
