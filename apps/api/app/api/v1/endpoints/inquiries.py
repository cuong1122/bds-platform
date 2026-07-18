from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.inquiry import Inquiry
from app.models.listing import Listing
from app.schemas.inquiry import InquiryCreate
from app.core.email import send_inquiry_notification

router = APIRouter(tags=["inquiries"])


@router.post("/listings/{listing_id}/inquiries", status_code=201)
def create_inquiry(
    listing_id: int,
    payload: InquiryCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    inquiry = Inquiry(
        listing_id=listing_id,
        session_id=payload.session_id,
        full_name=payload.full_name,
        phone=payload.phone,
        email=payload.email,
        preferred_time=payload.preferred_time,
        message=payload.message,
    )
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)

    # Gửi email chạy nền - không làm chậm response, và nếu SMTP lỗi
    # thì yêu cầu vẫn được lưu DB thành công (đã lưu ở trên rồi)
    background_tasks.add_task(
        send_inquiry_notification,
        {
            "listing_code": listing.code,
            "building_name": listing.building_name,
            "full_name": payload.full_name,
            "phone": payload.phone,
            "email": payload.email,
            "preferred_time": payload.preferred_time,
            "message": payload.message,
        },
    )

    return {"id": inquiry.id, "message": "Đã gửi yêu cầu liên hệ thành công"}
