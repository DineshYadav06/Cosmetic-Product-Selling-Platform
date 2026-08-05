from beanie import Document, Link
from pydantic import BaseModel, Field
from typing import List
from datetime import datetime, timezone
from app.models.user_model import User
from app.models.product_model import Product

class CartItem(BaseModel):
    product: Link[Product]
    quantity: int = 1

class Cart(Document):
    user: Link[User]
    items: List[CartItem] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "carts"
