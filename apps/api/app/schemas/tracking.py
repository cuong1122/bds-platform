from typing import Optional
from pydantic import BaseModel, Field


class ListingViewCreate(BaseModel):
    session_id: str = Field(..., min_length=8, max_length=64)
    duration_seconds: Optional[float] = Field(None, ge=0)
