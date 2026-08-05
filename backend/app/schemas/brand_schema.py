from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class BrandBase(BaseModel):
    name: str
    description: Optional[str] = None
    logo_url: Optional[str] = None

class BrandCreate(BrandBase):
    pass

class BrandUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    logo_url: Optional[str] = None

class BrandResponse(BrandBase):
    id: str = Field(alias="_id")
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True
