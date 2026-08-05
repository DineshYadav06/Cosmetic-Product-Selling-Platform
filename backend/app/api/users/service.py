from app.api.users.repository import user_repository
from app.schemas.user_schema import UserCreate, UserUpdate
from app.config.security import get_password_hash
from fastapi import HTTPException, status
from app.models.user_model import User

class UserService:
    async def create_user(self, user_in: UserCreate) -> User:
        existing_user = await user_repository.get_by_email(user_in.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with this email already exists."
            )
        hashed_password = get_password_hash(user_in.password)
        db_user = User(
            first_name=user_in.first_name,
            last_name=user_in.last_name,
            email=user_in.email,
            phone=user_in.phone,
            hashed_password=hashed_password,
            role="USER"
        )
        await db_user.insert()\n        from app.api.auth.service import auth_service\n        await auth_service.send_registration_otp(user_in.email)\n        return db_user
        
    async def get_user(self, user_id: str) -> User:
        user = await user_repository.get(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user

user_service = UserService()
