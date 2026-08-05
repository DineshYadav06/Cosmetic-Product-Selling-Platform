from fastapi import Depends, HTTPException, status
from app.models.user_model import User
from app.dependencies.auth import get_current_user

def require_role(required_role: str):
    def role_dependency(current_user: User = Depends(get_current_user)):
        if current_user.role != required_role and current_user.role != "ADMIN":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action"
            )
        return current_user
    return role_dependency
