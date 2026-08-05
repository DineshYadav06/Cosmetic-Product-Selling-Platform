from app.api.cart.repository import cart_repository
from app.api.products.repository import product_repository
from app.schemas.cart_schema import CartAdd
from app.models.user_model import User
from app.models.cart_model import CartItem
from fastapi import HTTPException

class CartService:
    async def get_user_cart(self, current_user: User):
        return await cart_repository.get_cart_by_user(current_user)

    async def add_to_cart(self, current_user: User, item: CartAdd):
        cart = await cart_repository.get_cart_by_user(current_user)
        product = await product_repository.get(item.product_id)
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
            
        # Check if product already in cart
        existing_item = next((i for i in cart.items if i.product.id == product.id), None)
        if existing_item:
            existing_item.quantity += item.quantity
        else:
            cart.items.append(CartItem(product=product, quantity=item.quantity))
            
        await cart.save()
        return cart

cart_service = CartService()
