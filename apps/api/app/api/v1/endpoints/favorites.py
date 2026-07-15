from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.db.session import get_db
from app.models.favorite import Favorite
from app.schemas.favorite import FavoriteToggle, FavoriteListingIds

router = APIRouter(tags=["favorites"])


@router.post("/listings/{listing_id}/favorite", status_code=204)
def add_favorite(listing_id: int, payload: FavoriteToggle, db: Session = Depends(get_db)):
    existing = db.query(Favorite).filter(
        Favorite.listing_id == listing_id,
        Favorite.session_id == payload.session_id,
    ).first()
    if existing:
        return None  # đã yêu thích rồi, không làm gì thêm

    db.add(Favorite(listing_id=listing_id, session_id=payload.session_id))
    try:
        db.commit()
    except IntegrityError:
        db.rollback()  # race condition hiếm gặp, bỏ qua vì đã tồn tại
    return None


@router.delete("/listings/{listing_id}/favorite", status_code=204)
def remove_favorite(
    listing_id: int,
    session_id: str = Query(...),
    db: Session = Depends(get_db),
):
    db.query(Favorite).filter(
        Favorite.listing_id == listing_id,
        Favorite.session_id == session_id,
    ).delete()
    db.commit()
    return None


@router.get("/favorites", response_model=FavoriteListingIds)
def get_favorites(session_id: str = Query(...), db: Session = Depends(get_db)):
    rows = db.query(Favorite.listing_id).filter(Favorite.session_id == session_id).all()
    return {"listing_ids": [r[0] for r in rows]}
