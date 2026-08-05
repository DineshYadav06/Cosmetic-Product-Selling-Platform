from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    stock: int = 0
    images: List[str] = []
    skin_types: List[str] = []
    ingredients: Optional[str] = None
    is_featured: bool = False

class ProductCreate(ProductBase):
    category_id: str
    brand_id: str

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    images: Optional[List[str]] = None
    category_id: Optional[str] = None
    brand_id: Optional[str] = None
    skin_types: Optional[List[str]] = None
    ingredients: Optional[str] = None
    is_featured: Optional[bool] = None

class ProductResponse(ProductBase):
    id: str = Field(alias="_id")
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True
