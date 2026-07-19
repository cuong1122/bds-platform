import cloudinary
import cloudinary.uploader

from app.core.config import settings

cloudinary.config(
    cloud_name=settings.cloudinary_cloud_name,
    api_key=settings.cloudinary_api_key,
    api_secret=settings.cloudinary_api_secret,
    secure=True,
)


def upload_image(file_bytes: bytes, folder: str = "bds-platform") -> str:
    """Upload ảnh lên Cloudinary, trả về URL công khai (https, đã tối ưu qua CDN)."""
    result = cloudinary.uploader.upload(
        file_bytes,
        folder=folder,
        resource_type="image",
    )
    return result["secure_url"]
