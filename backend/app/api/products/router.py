from fastapi import APIRouter, Depends
from app.schemas.product_schema import ProductCreate, ProductResponse
from app.api.products.service import product_service
from app.dependencies.roles import require_role
from typing import List

router = APIRouter(prefix="/products", tags=["Products"])

@router.post("/", response_model=ProductResponse, status_code=201, dependencies=[Depends(require_role("ADMIN"))])
async def create_product(product_in: ProductCreate):
    return await product_service.create_product(product_in)

@router.get("/", response_model=List[ProductResponse])
async def get_products():
    return await product_service.get_all_products()

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    return await product_service.get_product(product_id)
