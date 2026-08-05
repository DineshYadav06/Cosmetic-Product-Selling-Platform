from app.api.brands.repository import brand_repository
from app.schemas.brand_schema import BrandCreate, BrandUpdate
from fastapi import HTTPException
from app.models.brand_model import Brand

class BrandService:
    async def create_brand(self, brand_in: BrandCreate) -> Brand:
        return await brand_repository.create(brand_in)

    async def get_all_brands(self, skip: int = 0, limit: int = 100):
        return await brand_repository.get_all(skip, limit)

    async def get_brand(self, brand_id: str) -> Brand:
        brand = await brand_repository.get(brand_id)
        if not brand:
            raise HTTPException(status_code=404, detail="Brand not found")
        return brand

brand_service = BrandService()
