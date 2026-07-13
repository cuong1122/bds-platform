from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

from app.schemas.enums import ListingStatus, Direction


class ListingImageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    url: str
    order: int
    is_cover: bool
    caption: Optional[str] = None


class TagOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    type: str


class BuildingMinimal(BaseModel):
    """Dùng lồng trong Detail API"""
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    address: str


class BuildingOut(BaseModel):
    """Dùng cho GET /buildings"""
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    address: str
    lat: Optional[float] = None
    lng: Optional[float] = None
    cover_image: Optional[str] = None


class ListingOut(BaseModel):
    """Detail API - GET /listings/{id} - building lồng đầy đủ"""
    model_config = ConfigDict(from_attributes=True)
    id: int
    building: BuildingMinimal
    code: str
    price: Decimal
    area: float
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    floor: Optional[int] = None
    direction: Optional[Direction] = None
    status: ListingStatus
    description: Optional[str] = None
    created_at: datetime
    images: list[ListingImageOut] = Field(default_factory=list)
    tags: list[TagOut] = Field(default_factory=list)


class ListingListItem(BaseModel):
    """List API - GET /listings - building_name phẳng, tránh N+1"""
    model_config = ConfigDict(from_attributes=True)
    id: int
    building_name: str
    code: str
    price: Decimal
    area: float
    bedrooms: Optional[int] = None
    status: ListingStatus
    images: list[ListingImageOut] = Field(default_factory=list)


class PaginatedListings(BaseModel):
    total: int
    page: int
    page_size: int
    total_pages: int
    has_next: bool
    has_previous: bool
    items: list[ListingListItem]
