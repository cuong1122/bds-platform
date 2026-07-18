from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func

from app.db.session import get_db
from app.api.deps import get_current_admin
from app.models.user import User
from app.models.inquiry import Inquiry
from app.models.listing import Listing
from app.models.building import Building
from app.models.listing_view import ListingView
from app.models.favorite import Favorite
from app.schemas.inquiry import InquiryOut, InquiryConfirmUpdate

router = APIRouter(prefix="/admin", tags=["admin"])


def _serialize_inquiry(inquiry: Inquiry) -> dict:
    return {
        "id": inquiry.id,
        "listing_id": inquiry.listing_id,
        "listing_code": inquiry.listing.code,
        "building_name": inquiry.listing.building_name,
        "full_name": inquiry.full_name,
        "phone": inquiry.phone,
        "email": inquiry.email,
        "preferred_time": inquiry.preferred_time,
        "message": inquiry.message,
        "is_confirmed": inquiry.is_confirmed,
        "created_at": inquiry.created_at,
    }


@router.get("/inquiries", response_model=list[InquiryOut])
def list_inquiries(
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    inquiries = (
        db.query(Inquiry)
        .options(joinedload(Inquiry.listing).joinedload(Listing.building))
        .order_by(Inquiry.is_confirmed.asc(), Inquiry.created_at.desc())
        .all()
    )
    return [_serialize_inquiry(i) for i in inquiries]


@router.patch("/inquiries/{inquiry_id}", response_model=InquiryOut)
def update_inquiry(
    inquiry_id: int,
    payload: InquiryConfirmUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    inquiry = (
        db.query(Inquiry)
        .options(joinedload(Inquiry.listing).joinedload(Listing.building))
        .filter(Inquiry.id == inquiry_id)
        .first()
    )
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    inquiry.is_confirmed = payload.is_confirmed
    db.commit()
    db.refresh(inquiry)
    return _serialize_inquiry(inquiry)


@router.get("/listings-interest")
def get_listings_interest(
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    views_subq = (
        db.query(ListingView.listing_id, func.count(ListingView.id).label("view_count"))
        .group_by(ListingView.listing_id)
        .subquery()
    )
    favorites_subq = (
        db.query(Favorite.listing_id, func.count(Favorite.id).label("favorite_count"))
        .group_by(Favorite.listing_id)
        .subquery()
    )
    inquiries_subq = (
        db.query(Inquiry.listing_id, func.count(Inquiry.id).label("inquiry_count"))
        .group_by(Inquiry.listing_id)
        .subquery()
    )

    rows = (
        db.query(
            Listing.id,
            Listing.code,
            Building.name.label("building_name"),
            func.coalesce(views_subq.c.view_count, 0).label("view_count"),
            func.coalesce(favorites_subq.c.favorite_count, 0).label("favorite_count"),
            func.coalesce(inquiries_subq.c.inquiry_count, 0).label("inquiry_count"),
        )
        .join(Building, Building.id == Listing.building_id)
        .outerjoin(views_subq, views_subq.c.listing_id == Listing.id)
        .outerjoin(favorites_subq, favorites_subq.c.listing_id == Listing.id)
        .outerjoin(inquiries_subq, inquiries_subq.c.listing_id == Listing.id)
        .all()
    )

    result = [
        {
            "listing_id": r.id,
            "listing_code": r.code,
            "building_name": r.building_name,
            "view_count": r.view_count,
            "favorite_count": r.favorite_count,
            "inquiry_count": r.inquiry_count,
            "interest_score": r.view_count + r.favorite_count * 3 + r.inquiry_count * 5,
        }
        for r in rows
    ]
    result.sort(key=lambda x: x["interest_score"], reverse=True)
    return result
