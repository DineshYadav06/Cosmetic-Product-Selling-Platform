from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ReviewCreate(BaseModel):
    product_id: str
    rating: int = Field(ge=1, le=5)
    comment: Optional[str] = None

class ReviewResponse(BaseModel):
    id: str = Field(alias="_id")
    rating: int
    comment: Optional[str]
    created_at: datetime
    
    class Config:
        populate_by_name = True
