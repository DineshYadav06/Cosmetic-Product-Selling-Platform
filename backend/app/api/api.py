from fastapi import APIRouter
from app.api.auth.router import router as auth_router
from app.api.users.router import router as users_router
from app.api.categories.router import router as categories_router
from app.api.brands.router import router as brands_router
from app.api.products.router import router as products_router
from app.api.cart.router import router as cart_router
from app.api.orders.router import router as orders_router
from app.api.payments.router import router as payments_router
from app.api.reviews.router import router as reviews_router
from app.api.coupons.router import router as coupons_router
from app.api.dashboard.router import router as dashboard_router
from app.api.ai.router import router as ai_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(categories_router)
api_router.include_router(brands_router)
api_router.include_router(products_router)
api_router.include_router(cart_router)
api_router.include_router(orders_router)
api_router.include_router(payments_router)
api_router.include_router(reviews_router)
api_router.include_router(coupons_router)
api_router.include_router(dashboard_router)
api_router.include_router(ai_router)

