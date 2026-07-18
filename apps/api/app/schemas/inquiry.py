from typing import Optional
from pydantic import BaseModel, Field, EmailStr


class InquiryCreate(BaseModel):
    session_id: Optional[str] = Field(None, max_length=64)
    full_name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=8, max_length=20)
    email: Optional[EmailStr] = None
    preferred_time: Optional[str] = Field(None, max_length=200)
    message: Optional[str] = Field(None, max_length=1000)
