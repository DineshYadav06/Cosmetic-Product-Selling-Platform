from app.utils.repository import BaseRepository
from app.models.cart_model import Cart
from app.models.user_model import User

class CartRepository(BaseRepository[Cart, dict, dict]):
    async def get_cart_by_user(self, user: User) -> Cart:
        cart = await self.model.find_one(self.model.user.id == user.id)
        if not cart:
            cart = Cart(user=user, items=[])
            await cart.insert()
        return cart

cart_repository = CartRepository(Cart)
