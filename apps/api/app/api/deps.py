from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.security import decode_access_token
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


def get_current_admin(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Không có quyền truy cập, vui lòng đăng nhập lại",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_error

    email = decode_access_token(token)
    if not email:
        raise credentials_error

    user = db.query(User).filter(User.email == email).first()
    if not user or user.role != "admin" or not user.is_active:
        raise credentials_error

    return user
