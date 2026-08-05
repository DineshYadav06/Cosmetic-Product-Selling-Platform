from app.utils.repository import BaseRepository
from app.models.coupon_model import Coupon

class CouponRepository(BaseRepository[Coupon, dict, dict]):
    async def get_by_code(self, code: str):
        return await self.model.find_one(self.model.code == code)

coupon_repository = CouponRepository(Coupon)
