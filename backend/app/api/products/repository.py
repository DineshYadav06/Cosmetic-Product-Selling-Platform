from app.utils.repository import BaseRepository
from app.models.product_model import Product
from app.schemas.product_schema import ProductCreate, ProductUpdate

class ProductRepository(BaseRepository[Product, ProductCreate, ProductUpdate]):
    async def create_with_links(self, obj_in: ProductCreate, category, brand) -> Product:
        db_obj = Product(
            name=obj_in.name,
            description=obj_in.description,
            price=obj_in.price,
            stock=obj_in.stock,
            images=obj_in.images,
            skin_types=obj_in.skin_types,
            ingredients=obj_in.ingredients,
            is_featured=obj_in.is_featured,
            category=category,
            brand=brand
        )
        return await db_obj.insert()

product_repository = ProductRepository(Product)
