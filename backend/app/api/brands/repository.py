from app.utils.repository import BaseRepository
from app.models.brand_model import Brand
from app.schemas.brand_schema import BrandCreate, BrandUpdate

class BrandRepository(BaseRepository[Brand, BrandCreate, BrandUpdate]):
    pass

brand_repository = BrandRepository(Brand)
