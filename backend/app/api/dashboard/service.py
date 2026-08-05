from app.models.user_model import User
from app.models.order_model import Order
from app.models.product_model import Product

class DashboardService:
    async def get_stats(self):
        total_users = await User.count()
        total_products = await Product.count()
        total_orders = await Order.count()
        
        # Simple aggregate for total revenue
        pipeline = [
            {"$match": {"status": {"$ne": "CANCELLED"}}},
            {"$group": {"_id": None, "total_revenue": {"$sum": "$total_amount"}}}
        ]
        revenue_result = await Order.aggregate(pipeline).to_list()
        total_revenue = revenue_result[0]["total_revenue"] if revenue_result else 0
        
        return {
            "total_users": total_users,
            "total_products": total_products,
            "total_orders": total_orders,
            "total_revenue": total_revenue
        }

dashboard_service = DashboardService()
