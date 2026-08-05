from fastapi import APIRouter, Depends, UploadFile, File
from app.schemas.ai_schema import AnalysisResponse, RecommendationResponse
from app.models.user_model import User
from app.dependencies.auth import get_current_user
from app.api.ai.service import ai_service

router = APIRouter(prefix="/ai", tags=["AI Skin Analysis"])

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_skin_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    '''
    Upload a facial image for AI skin analysis. 
    Requires JWT token.
    '''
    return await ai_service.analyze_skin(current_user, file)

@router.get("/recommendations", response_model=RecommendationResponse)
async def get_product_recommendations(skin_type: str):
    '''
    Get cosmetic products tailored to a specific skin type.
    '''
    return await ai_service.get_recommendations(skin_type)
