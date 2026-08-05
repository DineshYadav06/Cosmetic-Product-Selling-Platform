from app.api.users.repository import user_repository
from app.schemas.auth_schema import LoginSchema, TokenResponse, OTPVerifySchema, EmailSchema
from app.config.security import verify_password, create_access_token
from fastapi import HTTPException, status
from app.utils.email_sender import send_otp_email
import random
from datetime import datetime, timedelta, timezone

class AuthService:
    def generate_otp(self):
        return str(random.randint(100000, 999999))

    async def authenticate_user(self, login_data: LoginSchema) -> TokenResponse:
        user = await user_repository.get_by_email(login_data.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        if not verify_password(login_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        if not user.is_verified:
            raise HTTPException(status_code=400, detail="Please verify your email first.")
            
        access_token = create_access_token(subject=str(user.id), role=user.role)
        return TokenResponse(access_token=access_token, role=user.role)

    async def send_registration_otp(self, email: str):
        user = await user_repository.get_by_email(email)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        otp = self.generate_otp()
        user.otp = otp
        user.otp_expiry = datetime.now(timezone.utc) + timedelta(minutes=5)
        await user.save()
        
        success = await send_otp_email(email, otp)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to send OTP email")
        return {"message": "OTP sent successfully"}

    async def verify_registration_otp(self, data: OTPVerifySchema):
        user = await user_repository.get_by_email(data.email)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        if user.is_verified:
            return {"message": "User is already verified"}
            
        if user.otp != data.otp:
            raise HTTPException(status_code=400, detail="Invalid OTP")
            
        if user.otp_expiry and user.otp_expiry < datetime.now(timezone.utc):
            raise HTTPException(status_code=400, detail="OTP has expired")
            
        user.is_verified = True
        user.otp = None
        user.otp_expiry = None
        await user.save()
        return {"message": "Email verified successfully"}

    async def send_login_otp(self, data: EmailSchema):
        user = await user_repository.get_by_email(data.email)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        if not user.is_verified:
            raise HTTPException(status_code=400, detail="Please verify your email first.")
            
        otp = self.generate_otp()
        user.otp = otp
        user.otp_expiry = datetime.now(timezone.utc) + timedelta(minutes=5)
        await user.save()
        
        success = await send_otp_email(data.email, otp)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to send OTP email")
        return {"message": "OTP sent successfully for login"}

    async def verify_login_otp(self, data: OTPVerifySchema) -> TokenResponse:
        user = await user_repository.get_by_email(data.email)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        if user.otp != data.otp:
            raise HTTPException(status_code=400, detail="Invalid OTP")
            
        if user.otp_expiry and user.otp_expiry < datetime.now(timezone.utc):
            raise HTTPException(status_code=400, detail="OTP has expired")
            
        # Clear OTP
        user.otp = None
        user.otp_expiry = None
        await user.save()
        
        access_token = create_access_token(subject=str(user.id), role=user.role)
        return TokenResponse(access_token=access_token, role=user.role)

auth_service = AuthService()
