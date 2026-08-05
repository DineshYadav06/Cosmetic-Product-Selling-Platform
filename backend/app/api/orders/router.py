from fastapi import APIRouter, Depends
from app.schemas.order_schema import OrderCreate, OrderResponse
from app.models.user_model import User
from app.dependencies.auth import get_current_user
from app.api.orders.service import order_service
from typing import List

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("/", response_model=OrderResponse)
async def create_order(order_in: OrderCreate, current_user: User = Depends(get_current_user)):
    return await order_service.create_order(current_user, order_in)

@router.get("/", response_model=List[OrderResponse])
async def get_my_orders(current_user: User = Depends(get_current_user)):
    return await order_service.get_user_orders(current_user)
