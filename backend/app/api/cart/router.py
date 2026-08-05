from fastapi import APIRouter, Depends
from app.schemas.cart_schema import CartAdd
from app.models.user_model import User
from app.dependencies.auth import get_current_user
from app.api.cart.service import cart_service

router = APIRouter(prefix="/cart", tags=["Cart"])

@router.get("/")
async def get_cart(current_user: User = Depends(get_current_user)):
    return await cart_service.get_user_cart(current_user)

@router.post("/add")
async def add_to_cart(item: CartAdd, current_user: User = Depends(get_current_user)):
    return await cart_service.add_to_cart(current_user, item)
