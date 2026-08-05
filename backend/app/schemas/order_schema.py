from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class OrderItemBase(BaseModel):
    product_id: str
    quantity: int

class OrderCreate(BaseModel):
    shipping_address: str
    payment_method: str

class OrderResponse(BaseModel):
    id: str = Field(alias="_id")
    total_amount: float
    status: str
    shipping_address: str
    payment_method: str
    is_paid: bool
    created_at: datetime
    
    class Config:
        populate_by_name = True
