from app.utils.repository import BaseRepository
from app.models.order_model import Order
from app.models.user_model import User

class OrderRepository(BaseRepository[Order, dict, dict]):
    async def get_user_orders(self, user: User):
        return await self.model.find(self.model.user.id == user.id).to_list()

order_repository = OrderRepository(Order)
