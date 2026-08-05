from fastapi import APIRouter, Depends
from app.schemas.coupon_schema import CouponCreate, CouponResponse
from app.dependencies.roles import require_role
from app.api.coupons.service import coupon_service

router = APIRouter(prefix="/coupons", tags=["Coupons"])

@router.post("/", response_model=CouponResponse, dependencies=[Depends(require_role("ADMIN"))])
async def create_coupon(coupon_in: CouponCreate):
    return await coupon_service.create_coupon(coupon_in)

@router.get("/validate")
async def validate_coupon(code: str, order_value: float):
    return await coupon_service.validate_coupon(code, order_value)
