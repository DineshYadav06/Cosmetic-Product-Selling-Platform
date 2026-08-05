from app.utils.repository import BaseRepository
from app.models.category_model import Category
from app.schemas.category_schema import CategoryCreate, CategoryUpdate

class CategoryRepository(BaseRepository[Category, CategoryCreate, CategoryUpdate]):
    pass

category_repository = CategoryRepository(Category)
