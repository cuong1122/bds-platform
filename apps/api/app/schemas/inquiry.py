from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, EmailStr, ConfigDict


class InquiryCreate(BaseModel):
    session_id: Optional[str] = Field(None, max_length=64)
    full_name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=8, max_length=20)
    email: Optional[EmailStr] = None
    preferred_time: Optional[str] = Field(None, max_length=200)
    message: Optional[str] = Field(None, max_length=1000)


class InquiryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    listing_id: int
    listing_code: str
    building_name: str
    full_name: str
    phone: str
    email: Optional[str] = None
    preferred_time: Optional[str] = None
    message: Optional[str] = None
    is_confirmed: bool
    created_at: datetime


class InquiryConfirmUpdate(BaseModel):
    is_confirmed: bool
