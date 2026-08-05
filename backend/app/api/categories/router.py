from fastapi import APIRouter, Depends
from app.schemas.category_schema import CategoryCreate, CategoryResponse
from app.api.categories.service import category_service
from app.dependencies.roles import require_role
from typing import List

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.post("/", response_model=CategoryResponse, status_code=201, dependencies=[Depends(require_role("ADMIN"))])
async def create_category(category_in: CategoryCreate):
    return await category_service.create_category(category_in)

@router.get("/", response_model=List[CategoryResponse])
async def get_categories():
    return await category_service.get_all_categories()

@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(category_id: str):
    return await category_service.get_category(category_id)
