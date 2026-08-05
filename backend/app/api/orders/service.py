from app.api.orders.repository import order_repository
from app.api.cart.repository import cart_repository
from app.schemas.order_schema import OrderCreate
from app.models.user_model import User
from app.models.order_model import Order, OrderItem
from fastapi import HTTPException

class OrderService:
    async def create_order(self, current_user: User, order_in: OrderCreate):
        cart = await cart_repository.get_cart_by_user(current_user)
        if not cart.items:
            raise HTTPException(status_code=400, detail="Cart is empty")
            
        # Normally you would recalculate price from DB to avoid client-side price manipulation
        total_amount = 0.0
        order_items = []
        for item in cart.items:
            await item.product.fetch()
            price = item.product.price
            total_amount += price * item.quantity
            order_items.append(OrderItem(product=item.product, quantity=item.quantity, price_at_purchase=price))
            
        order = Order(
            user=current_user,
            items=order_items,
            total_amount=total_amount,
            shipping_address=order_in.shipping_address,
            payment_method=order_in.payment_method
        )
        await order.insert()
        
        # Clear cart
        cart.items = []
        await cart.save()
        
        return order

    async def get_user_orders(self, current_user: User):
        return await order_repository.get_user_orders(current_user)

order_service = OrderService()
