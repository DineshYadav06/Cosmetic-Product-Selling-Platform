from fastapi import APIRouter, Depends
from app.schemas.review_schema import ReviewCreate, ReviewResponse
from app.models.user_model import User
from app.dependencies.auth import get_current_user
from app.api.reviews.service import review_service
from typing import List

router = APIRouter(prefix="/reviews", tags=["Reviews"])

@router.post("/", response_model=ReviewResponse)
async def create_review(review_in: ReviewCreate, current_user: User = Depends(get_current_user)):
    return await review_service.create_review(current_user, review_in)
