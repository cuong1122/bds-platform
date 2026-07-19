from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.db.session import get_db
from app.api.deps import get_current_admin
from app.models.user import User
from app.models.listing import Listing
from app.models.listing_image import ListingImage
from app.models.building import Building
from app.schemas.listing_admin import ListingAdminOut, ListingCreate, ListingUpdate

router = APIRouter(prefix="/admin/listings", tags=["admin-listings"])


def _replace_images(db: Session, listing: Listing, image_urls: list[str]) -> None:
    """Xóa toàn bộ ảnh cũ của listing và tạo lại theo danh sách URL mới.
    Ảnh đầu tiên trong danh sách luôn là ảnh bìa (is_cover=True)."""
    db.query(ListingImage).filter(ListingImage.listing_id == listing.id).delete()
    for idx, url in enumerate(image_urls):
        db.add(ListingImage(
            listing_id=listing.id,
            url=url,
            order=idx,
            is_cover=(idx == 0),
        ))


def _get_listing_or_404(db: Session, listing_id: int) -> Listing:
    listing = (
        db.query(Listing)
        .options(joinedload(Listing.images), joinedload(Listing.building))
        .filter(Listing.id == listing_id)
        .first()
    )
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing


@router.get("", response_model=list[ListingAdminOut])
def list_listings(
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    listings = (
        db.query(Listing)
        .options(joinedload(Listing.images), joinedload(Listing.building))
        .order_by(Listing.created_at.desc())
        .all()
    )
    return listings


@router.post("", response_model=ListingAdminOut, status_code=201)
def create_listing(
    payload: ListingCreate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    building = db.query(Building).filter(Building.id == payload.building_id).first()
    if not building:
        raise HTTPException(status_code=400, detail="Tòa nhà không tồn tại")

    data = payload.model_dump(exclude={"image_urls"})
    listing = Listing(**data)
    db.add(listing)
    db.flush()  # để có listing.id trước khi tạo ảnh

    if payload.image_urls:
        _replace_images(db, listing, payload.image_urls)

    db.commit()
    return _get_listing_or_404(db, listing.id)


@router.put("/{listing_id}", response_model=ListingAdminOut)
def update_listing(
    listing_id: int,
    payload: ListingUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    update_data = payload.model_dump(exclude_unset=True, exclude={"image_urls"})

    if "building_id" in update_data:
        building = db.query(Building).filter(Building.id == update_data["building_id"]).first()
        if not building:
            raise HTTPException(status_code=400, detail="Tòa nhà không tồn tại")

    for field, value in update_data.items():
        setattr(listing, field, value)

    if payload.image_urls is not None:
        _replace_images(db, listing, payload.image_urls)

    db.commit()
    return _get_listing_or_404(db, listing_id)


@router.delete("/{listing_id}", status_code=204)
def delete_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    # listing_images, listing_tags, listing_views, favorites, inquiries đều CASCADE
    # theo thiết kế DB ban đầu, nên xóa listing sẽ tự dọn sạch dữ liệu liên quan.
    db.delete(listing)
    db.commit()
    return None
