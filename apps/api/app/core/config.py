from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str

    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 480  # 8 tiếng, đủ 1 ca làm việc

    smtp_host: Optional[str] = None
    smtp_port: int = 587
    smtp_user: Optional[str] = None
    smtp_password: Optional[str] = None
    smtp_use_tls: bool = True
    admin_email: Optional[str] = None

    class Config:
        env_file = ".env"

settings = Settings()
