from app.utils.repository import BaseRepository
from app.models.user_model import User
from app.schemas.user_schema import UserCreate, UserUpdate
from typing import Optional

class UserRepository(BaseRepository[User, UserCreate, UserUpdate]):
    async def get_by_email(self, email: str) -> Optional[User]:
        return await self.model.find_one(self.model.email == email)

user_repository = UserRepository(User)
