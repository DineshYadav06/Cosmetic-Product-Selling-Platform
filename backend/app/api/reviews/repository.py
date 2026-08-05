from app.utils.repository import BaseRepository
from app.models.review_model import Review

class ReviewRepository(BaseRepository[Review, dict, dict]):
    async def get_by_product(self, product_id: str):
        # We need to filter by the linked product's ID. 
        # In Beanie, querying by a link's ID is possible via the DBRef or nested queries.
        return await self.model.find({"product.$id": product_id}).to_list()

review_repository = ReviewRepository(Review)
