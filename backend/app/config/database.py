from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.config.settings import settings
import logging

logger = logging.getLogger(__name__)

async def init_db():
    logger.info("Initializing MongoDB connection...")
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    
    # Import all models here so Beanie can register them
    from app.models.user_model import User
    from app.models.category_model import Category
    from app.models.brand_model import Brand
    from app.models.product_model import Product
    from app.models.cart_model import Cart
    from app.models.order_model import Order
    from app.models.payment_model import Payment
    from app.models.review_model import Review
    from app.models.coupon_model import Coupon
    from app.models.analysis_model import AnalysisHistory
    
    await init_beanie(
        database=db,
        document_models=[
            User, Category, Brand, Product, Cart, Order, Payment, Review, Coupon, AnalysisHistory,
        ]
    )
    logger.info("MongoDB connection initialized successfully.")
