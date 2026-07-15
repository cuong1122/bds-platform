from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.listing_view import ListingView
from app.schemas.tracking import ListingViewCreate

router = APIRouter(prefix="/listings", tags=["tracking"])


@router.post("/{listing_id}/views", status_code=204)
def track_listing_view(
    listing_id: int,
    payload: ListingViewCreate,
    db: Session = Depends(get_db),
):
    if payload.duration_seconds is not None and payload.duration_seconds < 1:
        return None

    db.add(ListingView(
        listing_id=listing_id,
        session_id=payload.session_id,
        duration_seconds=payload.duration_seconds,
    ))
    db.commit()
    return None
