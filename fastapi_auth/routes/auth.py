from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from jose import jwt, JWTError

from models.database import get_db
from models.user import User
from schemas.user import UserCreate, UserLogin, UserResponse, OTPRequest, OTPVerify
from schemas.token import Token, TokenRefreshRequest
from services import auth_service, otp_service
from utils.security import create_access_token, create_refresh_token
from utils.email import send_otp_email
from core.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """ Register a new user using Email & Password. """
    return auth_service.create_user(db, user)

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """ Standard Email & Password Login. Returns access + refresh tokens. """
    user = auth_service.authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate tokens
    access_token = create_access_token(data={"sub": user.email})
    refresh_token = create_refresh_token(data={"sub": user.email})
    
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}


@router.post("/send-otp")
def send_otp(request: OTPRequest, db: Session = Depends(get_db)):
    """ Generate an OTP and send it to the user's email (Console simulation). """
    otp = otp_service.create_otp_for_email(db, request.email)
    
    # Send email (in production this connects to a real mail server)
    send_otp_email(request.email, otp)
    
    return {"message": "OTP has been sent to your email successfully."}

@router.post("/verify-otp", response_model=Token)
def verify_otp(request: OTPVerify, db: Session = Depends(get_db)):
    """ 
    Verify OTP. If successful, logs the user in.
    If the email doesn't exist in DB, we auto-register them implicitly.
    """
    is_valid = otp_service.verify_otp_for_email(db, request.email, request.otp)
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    
    # Check if user exists, if not, create a placeholder user profile
    user = auth_service.get_user_by_email(db, request.email)
    if not user:
        user = User(email=request.email)
        db.add(user)
        db.commit()
    
    # Generate tokens
    access_token = create_access_token(data={"sub": user.email})
    refresh_token = create_refresh_token(data={"sub": user.email})
    
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}


@router.post("/refresh-token", response_model=Token)
def refresh_token(request: TokenRefreshRequest, db: Session = Depends(get_db)):
    """ Obtain a new access token using a valid refresh token. """
    try:
        # Decode the refresh token
        payload = jwt.decode(request.refresh_token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        email: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        # Security validation to ensure access tokens aren't used here
        if email is None or token_type != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")
            
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
        
    user = auth_service.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
        
    # Generate fresh tokens
    access_token = create_access_token(data={"sub": user.email})
    new_refresh_token = create_refresh_token(data={"sub": user.email})
    
    return {"access_token": access_token, "refresh_token": new_refresh_token, "token_type": "bearer"}
