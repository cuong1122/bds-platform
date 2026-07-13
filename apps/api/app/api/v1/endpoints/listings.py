import math
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import asc, desc, or_

from app.db.session import get_db
from app.models.listing import Listing
from app.models.listing_tag import listing_tags
from app.schemas.listing import ListingOut, PaginatedListings
from app.schemas.listing_query import ListingFilter, ListingSort

router = APIRouter(prefix="/listings", tags=["listings"])


@router.get("", response_model=PaginatedListings)
def get_listings(
    db: Session = Depends(get_db),
    filters: ListingFilter = Depends(),
):
    query = db.query(Listing).options(
        joinedload(Listing.images), joinedload(Listing.building)
    )

    if filters.building_id is not None:
        query = query.filter(Listing.building_id == filters.building_id)
    if filters.status is not None:
        query = query.filter(Listing.status == filters.status.value)
    if filters.direction is not None:
        query = query.filter(Listing.direction == filters.direction.value)
    if filters.min_price is not None:
        query = query.filter(Listing.price >= filters.min_price)
    if filters.max_price is not None:
        query = query.filter(Listing.price <= filters.max_price)
    if filters.min_area is not None:
        query = query.filter(Listing.area >= filters.min_area)
    if filters.max_area is not None:
        query = query.filter(Listing.area <= filters.max_area)
    if filters.min_bedrooms is not None:
        query = query.filter(Listing.bedrooms >= filters.min_bedrooms)
    if filters.tag_ids:
        query = query.join(listing_tags).filter(
            listing_tags.c.tag_id.in_(filters.tag_ids)
        ).distinct()
    if filters.search:
        keyword = f"%{filters.search}%"
        query = query.filter(
            or_(
                Listing.code.ilike(keyword),
                Listing.description.ilike(keyword),
            )
        )

    # Sorting
    sort_map = {
        ListingSort.PRICE_ASC: asc(Listing.price),
        ListingSort.PRICE_DESC: desc(Listing.price),
        ListingSort.AREA_ASC: asc(Listing.area),
        ListingSort.AREA_DESC: desc(Listing.area),
        ListingSort.CREATED_DESC: desc(Listing.created_at),
        ListingSort.PRICE_PER_M2_ASC: asc(Listing.price / Listing.area),
        ListingSort.PRICE_PER_M2_DESC: desc(Listing.price / Listing.area),
    }
    query = query.order_by(sort_map.get(filters.sort, desc(Listing.created_at)))

    total = query.count()
    items = query.offset((filters.page - 1) * filters.page_size).limit(filters.page_size).all()
    total_pages = math.ceil(total / filters.page_size) if total > 0 else 0

    return {
        "total": total,
        "page": filters.page,
        "page_size": filters.page_size,
        "total_pages": total_pages,
        "has_next": filters.page < total_pages,
        "has_previous": filters.page > 1,
        "items": items,
    }


@router.get("/{listing_id}", response_model=ListingOut)
def get_listing_detail(listing_id: int, db: Session = Depends(get_db)):
    listing = (
        db.query(Listing)
        .options(
            joinedload(Listing.images),
            joinedload(Listing.tags),
            joinedload(Listing.building),
        )
        .filter(Listing.id == listing_id)
        .first()
    )
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing
