from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str

    smtp_host: Optional[str] = None
    smtp_port: int = 587
    smtp_user: Optional[str] = None
    smtp_password: Optional[str] = None
    smtp_use_tls: bool = True
    admin_email: Optional[str] = None

    class Config:
        env_file = ".env"

settings = Settings()
