import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.core.config import settings

logger = logging.getLogger(__name__)


def send_inquiry_notification(inquiry_data: dict) -> None:
    if not settings.smtp_host or not settings.admin_email:
        logger.warning("SMTP chưa được cấu hình, bỏ qua gửi email thông báo.")
        return

    subject = f"[BDS Platform] Yêu cầu liên hệ mới - Căn {inquiry_data['listing_code']}"
    body = (
        f"Có khách hàng mới quan tâm đến căn {inquiry_data['listing_code']} "
        f"({inquiry_data['building_name']}):\n\n"
        f"Họ tên: {inquiry_data['full_name']}\n"
        f"Số điện thoại: {inquiry_data['phone']}\n"
        f"Email: {inquiry_data.get('email') or '(không cung cấp)'}\n"
        f"Thời gian mong muốn xem nhà: {inquiry_data.get('preferred_time') or '(không chỉ định)'}\n"
        f"Ghi chú: {inquiry_data.get('message') or '(không có)'}\n"
    )

    msg = MIMEMultipart()
    msg["From"] = settings.smtp_user or settings.admin_email
    msg["To"] = settings.admin_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain", "utf-8"))

    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
            if settings.smtp_use_tls:
                server.starttls()
            if settings.smtp_user and settings.smtp_password:
                server.login(settings.smtp_user, settings.smtp_password)
            server.send_message(msg)
    except Exception as exc:
        logger.error(f"Gửi email thông báo thất bại: {exc}")
