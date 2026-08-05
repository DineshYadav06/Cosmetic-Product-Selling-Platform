from beanie import Document, Link
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone
from app.models.user_model import User
from app.models.product_model import Product

class OrderItem(BaseModel):
    product: Link[Product]
    quantity: int
    price_at_purchase: float

class Order(Document):
    user: Link[User]
    items: List[OrderItem]
    total_amount: float
    status: str = "PENDING"  # PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
    shipping_address: str
    payment_method: str = "CASH_ON_DELIVERY"
    is_paid: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "orders"
