from pydantic import BaseModel, Field
from typing import List
from datetime import datetime

class CartItemBase(BaseModel):
    product_id: str
    quantity: int

class CartAdd(CartItemBase):
    pass

class CartItemResponse(BaseModel):
    product_id: str
    quantity: int

class CartResponse(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    items: List[CartItemResponse]
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True
