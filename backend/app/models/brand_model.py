from beanie import Document
from datetime import datetime, timezone
from pydantic import Field
from typing import Optional

class Brand(Document):
    name: str
    description: Optional[str] = None
    logo_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "brands"
