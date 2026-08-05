from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import jwt, JWTError

from models.database import get_db
from models.user import User
from services.auth_service import get_user_by_email
from core.config import settings

router = APIRouter(prefix="/data", tags=["Protected Data"])

# Setup generic OAuth2 password bearer to scrape token from 'Authorization: Bearer <token>' header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """ Custom dependency middleware to enforce valid JWT token access. """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        email: str = payload.get("sub")
        
        if email is None:
            raise credentials_exception
            
        # Reject refresh tokens sent to protected endpoints
        if payload.get("type") == "refresh":
             raise HTTPException(status_code=401, detail="Cannot use refresh token to access APIs")
             
    except JWTError:
        raise credentials_exception
        
    user = get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
        
    return user


@router.get("/protected-route")
def read_secure_data(current_user: User = Depends(get_current_user)):
    """ This endpoint rejects anyone who does not supply a valid Access JWT. """
    return {
        "message": "Welcome to the VIP area!", 
        "user": current_user.email,
        "note": "If you are seeing this, your Authorization header verified successfully."
    }
