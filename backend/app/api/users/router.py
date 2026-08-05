from fastapi import APIRouter, Depends
from app.schemas.user_schema import UserResponse, UserUpdate
from app.models.user_model import User
from app.dependencies.auth import get_current_user
from app.dependencies.roles import require_role
from app.api.users.service import user_service

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/{user_id}", response_model=UserResponse, dependencies=[Depends(require_role("ADMIN"))])
async def get_user_by_id(user_id: str):
    return await user_service.get_user(user_id)
