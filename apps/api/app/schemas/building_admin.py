from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class BuildingAdminOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    address: str
    lat: Optional[float] = None
    lng: Optional[float] = None
    description: Optional[str] = None
    year_built: Optional[int] = None
    total_floors: Optional[int] = None
    cover_image: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None


class BuildingCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    address: str = Field(..., min_length=1, max_length=300)
    lat: Optional[float] = None
    lng: Optional[float] = None
    description: Optional[str] = None
    year_built: Optional[int] = Field(None, ge=1900, le=2100)
    total_floors: Optional[int] = Field(None, ge=1)
    cover_image: Optional[str] = None


class BuildingUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    address: Optional[str] = Field(None, min_length=1, max_length=300)
    lat: Optional[float] = None
    lng: Optional[float] = None
    description: Optional[str] = None
    year_built: Optional[int] = Field(None, ge=1900, le=2100)
    total_floors: Optional[int] = Field(None, ge=1)
    cover_image: Optional[str] = None
