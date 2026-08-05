from app.api.categories.repository import category_repository
from app.schemas.category_schema import CategoryCreate, CategoryUpdate
from fastapi import HTTPException
from app.models.category_model import Category

class CategoryService:
    async def create_category(self, category_in: CategoryCreate) -> Category:
        return await category_repository.create(category_in)

    async def get_all_categories(self, skip: int = 0, limit: int = 100):
        return await category_repository.get_all(skip, limit)

    async def get_category(self, category_id: str) -> Category:
        category = await category_repository.get(category_id)
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        return category

category_service = CategoryService()
