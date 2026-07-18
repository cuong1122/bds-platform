import sys

from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import hash_password


def create_admin(email: str, password: str, full_name: str = "Admin"):
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            existing.hashed_password = hash_password(password)
            existing.role = "admin"
            existing.is_active = True
            db.commit()
            print(f"Đã cập nhật lại mật khẩu cho tài khoản: {email}")
            return

        user = User(
            email=email,
            hashed_password=hash_password(password),
            full_name=full_name,
            role="admin",
            is_active=True,
        )
        db.add(user)
        db.commit()
        print(f"Đã tạo tài khoản admin mới: {email}")
    finally:
        db.close()


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Cách dùng: python -m app.seed_admin <email> <password>")
        sys.exit(1)
    create_admin(sys.argv[1], sys.argv[2])
