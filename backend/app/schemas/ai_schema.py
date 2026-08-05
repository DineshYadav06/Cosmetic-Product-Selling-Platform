from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.schemas.product_schema import ProductResponse

class AnalysisResponse(BaseModel):
    skin_type: str
    confidence: float
    message: str

class RecommendationResponse(BaseModel):
    skin_type: str
    recommended_products: List[ProductResponse]
