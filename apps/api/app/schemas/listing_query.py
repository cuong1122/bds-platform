from decimal import Decimal
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field

from app.schemas.enums import ListingStatus, Direction


class ListingSort(str, Enum):
    PRICE_ASC = "price_asc"
    PRICE_DESC = "price_desc"
    AREA_ASC = "area_asc"
    AREA_DESC = "area_desc"
    CREATED_DESC = "created_desc"
    PRICE_PER_M2_ASC = "price_per_m2_asc"
    PRICE_PER_M2_DESC = "price_per_m2_desc"


class ListingFilter(BaseModel):
    # Filter cơ bản
    building_id: Optional[int] = None
    status: Optional[ListingStatus] = None
    direction: Optional[Direction] = None

    # Khoảng giá
    min_price: Optional[Decimal] = Field(None, ge=0)
    max_price: Optional[Decimal] = Field(None, ge=0)

    # Khoảng diện tích
    min_area: Optional[float] = Field(None, gt=0)
    max_area: Optional[float] = Field(None, gt=0)

    # Số phòng ngủ tối thiểu (UX thực tế: ">= N phòng", không phải "đúng N")
    min_bedrooms: Optional[int] = Field(None, ge=0)

    # Filter theo tag (nhiều tag cùng lúc, vd: có hồ bơi + view sông)
    tag_ids: Optional[list[int]] = None

    # Tìm kiếm tự do
    search: Optional[str] = None

    # Sắp xếp
    sort: Optional[ListingSort] = ListingSort.CREATED_DESC

    # Phân trang
    page: int = Field(1, ge=1)
    page_size: int = Field(20, ge=1, le=100)
