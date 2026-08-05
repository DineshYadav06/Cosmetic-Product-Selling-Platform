from beanie import Document, Link
from pydantic import Field
from datetime import datetime, timezone
from app.models.order_model import Order
from app.models.user_model import User

class Payment(Document):
    order: Link[Order]
    user: Link[User]
    transaction_id: str
    amount: float
    status: str = "COMPLETED" # PENDING, COMPLETED, FAILED, REFUNDED
    payment_gateway: str = "RAZORPAY"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    class Settings:
        name = "payments"
