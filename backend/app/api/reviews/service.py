from app.api.reviews.repository import review_repository
from app.api.products.repository import product_repository
from app.schemas.review_schema import ReviewCreate
from app.models.user_model import User
from app.models.review_model import Review
from fastapi import HTTPException

class ReviewService:
    async def create_review(self, current_user: User, review_in: ReviewCreate):
        product = await product_repository.get(review_in.product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
            
        review = Review(
            product=product,
            user=current_user,
            rating=review_in.rating,
            comment=review_in.comment
        )
        return await review.insert()
        
    async def get_product_reviews(self, product_id: str):
        return await review_repository.get_by_product(product_id)

review_service = ReviewService()
