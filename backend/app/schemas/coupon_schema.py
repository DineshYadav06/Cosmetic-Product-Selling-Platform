from pydantic import BaseModel, Field
from datetime import datetime

class CouponCreate(BaseModel):
    code: str
    discount_percentage: float = Field(ge=0.0, le=100.0)
    max_discount_amount: float
    min_order_value: float
    expiry_date: datetime

class CouponResponse(CouponCreate):
    id: str = Field(alias="_id")
    is_active: bool
    created_at: datetime

    class Config:
        populate_by_name = True
