from beanie import Document
from pydantic import EmailStr, Field
from datetime import datetime, timezone
from typing import Optional

class User(Document):
    first_name: str
    last_name: str
    email: EmailStr
    hashed_password: str
    phone: Optional[str] = None
    role: str = "USER"  # "USER", "ADMIN", "SELLER"
    is_active: bool = True
    is_verified: bool = False
    otp: Optional[str] = None
    otp_expiry: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "users"
        indexes = [
            "email",
        ]
