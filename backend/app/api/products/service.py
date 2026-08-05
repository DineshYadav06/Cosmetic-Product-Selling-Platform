from app.api.products.repository import product_repository
from app.api.categories.repository import category_repository
from app.api.brands.repository import brand_repository
from app.schemas.product_schema import ProductCreate, ProductUpdate
from fastapi import HTTPException
from app.models.product_model import Product

class ProductService:
    async def create_product(self, product_in: ProductCreate) -> Product:
        category = await category_repository.get(product_in.category_id)
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
            
        brand = await brand_repository.get(product_in.brand_id)
        if not brand:
            raise HTTPException(status_code=404, detail="Brand not found")
            
        return await product_repository.create_with_links(product_in, category, brand)

    async def get_all_products(self, skip: int = 0, limit: int = 100):
        return await product_repository.get_all(skip, limit)

    async def get_product(self, product_id: str) -> Product:
        product = await product_repository.get(product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        await product.fetch_all_links()
        return product

product_service = ProductService()
