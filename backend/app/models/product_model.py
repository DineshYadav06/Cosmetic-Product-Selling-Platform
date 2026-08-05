from beanie import Document, Link
from datetime import datetime, timezone
from pydantic import Field
from typing import List, Optional
from app.models.category_model import Category
from app.models.brand_model import Brand

class Product(Document):
    name: str
    description: str
    price: float
    stock: int = 0
    images: List[str] = []
    category: Link[Category]
    brand: Link[Brand]
    skin_types: List[str] = []  # Oily, Dry, Combination, etc.
    ingredients: Optional[str] = None
    is_featured: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "products"
