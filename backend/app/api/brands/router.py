from fastapi import APIRouter, Depends
from app.schemas.brand_schema import BrandCreate, BrandResponse
from app.api.brands.service import brand_service
from app.dependencies.roles import require_role
from typing import List

router = APIRouter(prefix="/brands", tags=["Brands"])

@router.post("/", response_model=BrandResponse, status_code=201, dependencies=[Depends(require_role("ADMIN"))])
async def create_brand(brand_in: BrandCreate):
    return await brand_service.create_brand(brand_in)

@router.get("/", response_model=List[BrandResponse])
async def get_brands():
    return await brand_service.get_all_brands()

@router.get("/{brand_id}", response_model=BrandResponse)
async def get_brand(brand_id: str):
    return await brand_service.get_brand(brand_id)
