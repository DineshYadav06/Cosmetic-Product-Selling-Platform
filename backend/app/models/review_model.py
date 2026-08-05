from beanie import Document, Link
from pydantic import Field
from typing import Optional
from datetime import datetime, timezone
from app.models.user_model import User
from app.models.product_model import Product

class Review(Document):
    product: Link[Product]
    user: Link[User]
    rating: int = Field(ge=1, le=5)
    comment: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "reviews"
