from fastapi import APIRouter, Depends, HTTPException, UploadFile, File

from app.api.deps import get_current_admin
from app.models.user import User
from app.core.cloudinary_client import upload_image

router = APIRouter(prefix="/admin/upload", tags=["admin-upload"])

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024  # 5MB


@router.post("/image")
async def upload_image_endpoint(
    file: UploadFile = File(...),
    _admin: User = Depends(get_current_admin),
):
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Định dạng ảnh không hợp lệ. Chỉ chấp nhận JPEG, PNG, WEBP, GIF.",
        )

    contents = await file.read()

    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail="Ảnh quá lớn. Kích thước tối đa là 5MB.",
        )

    try:
        url = upload_image(contents)
    except Exception:
        raise HTTPException(
            status_code=502,
            detail="Tải ảnh lên thất bại. Vui lòng thử lại.",
        )

    return {"url": url}
