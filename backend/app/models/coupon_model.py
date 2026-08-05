from beanie import Document
from pydantic import Field
from datetime import datetime, timezone

class Coupon(Document):
    code: str
    discount_percentage: float = Field(ge=0.0, le=100.0)
    max_discount_amount: float
    min_order_value: float
    is_active: bool = True
    expiry_date: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "coupons"
        indexes = ["code"]
