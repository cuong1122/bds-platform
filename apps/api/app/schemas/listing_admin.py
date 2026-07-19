from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

from app.schemas.enums import ListingStatus, Direction


class ListingImageAdmin(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    url: str
    order: int
    is_cover: bool
    caption: Optional[str] = None


class ListingAdminOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    building_id: int
    building_name: str
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
    updated_at: Optional[datetime] = None
    images: list[ListingImageAdmin] = Field(default_factory=list)


class ListingCreate(BaseModel):
    building_id: int
    code: str = Field(..., min_length=1, max_length=50)
    price: Decimal = Field(..., ge=0)
    area: float = Field(..., gt=0)
    bedrooms: Optional[int] = Field(None, ge=0)
    bathrooms: Optional[int] = Field(None, ge=0)
    floor: Optional[int] = None
    direction: Optional[Direction] = None
    status: ListingStatus = ListingStatus.AVAILABLE
    description: Optional[str] = None
    # Danh sách URL ảnh - ảnh đầu tiên tự động là ảnh bìa (is_cover)
    image_urls: list[str] = Field(default_factory=list)


class ListingUpdate(BaseModel):
    building_id: Optional[int] = None
    code: Optional[str] = Field(None, min_length=1, max_length=50)
    price: Optional[Decimal] = Field(None, ge=0)
    area: Optional[float] = Field(None, gt=0)
    bedrooms: Optional[int] = Field(None, ge=0)
    bathrooms: Optional[int] = Field(None, ge=0)
    floor: Optional[int] = None
    direction: Optional[Direction] = None
    status: Optional[ListingStatus] = None
    description: Optional[str] = None
    # Nếu gửi trường này, TOÀN BỘ ảnh cũ sẽ bị thay thế bằng danh sách mới
    image_urls: Optional[list[str]] = None
