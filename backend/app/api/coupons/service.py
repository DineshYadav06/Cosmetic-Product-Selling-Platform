from app.api.coupons.repository import coupon_repository
from app.schemas.coupon_schema import CouponCreate
from app.models.coupon_model import Coupon
from fastapi import HTTPException
from datetime import datetime, timezone

class CouponService:
    async def create_coupon(self, coupon_in: CouponCreate):
        existing = await coupon_repository.get_by_code(coupon_in.code)
        if existing:
            raise HTTPException(status_code=400, detail="Coupon code already exists")
            
        coupon = Coupon(
            code=coupon_in.code,
            discount_percentage=coupon_in.discount_percentage,
            max_discount_amount=coupon_in.max_discount_amount,
            min_order_value=coupon_in.min_order_value,
            expiry_date=coupon_in.expiry_date
        )
        return await coupon.insert()
        
    async def validate_coupon(self, code: str, order_value: float):
        coupon = await coupon_repository.get_by_code(code)
        if not coupon:
            raise HTTPException(status_code=404, detail="Coupon not found")
        
        if not coupon.is_active:
            raise HTTPException(status_code=400, detail="Coupon is inactive")
            
        if coupon.expiry_date < datetime.now(timezone.utc):
            raise HTTPException(status_code=400, detail="Coupon is expired")
            
        if order_value < coupon.min_order_value:
            raise HTTPException(status_code=400, detail=f"Minimum order value should be {coupon.min_order_value}")
            
        discount = (coupon.discount_percentage / 100) * order_value
        if discount > coupon.max_discount_amount:
            discount = coupon.max_discount_amount
            
        return {"valid": True, "discount_amount": discount}

coupon_service = CouponService()
