from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.auth_schema import LoginSchema, TokenResponse, OTPVerifySchema, EmailSchema
from app.schemas.user_schema import UserCreate, UserResponse
from app.api.auth.service import auth_service
from app.api.users.service import user_service

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=201)
async def register(user_in: UserCreate):
    return await user_service.create_user(user_in)

@router.post("/verify-registration-otp")
async def verify_registration(data: OTPVerifySchema):
    return await auth_service.verify_registration_otp(data)

@router.post("/resend-registration-otp")
async def resend_registration_otp(data: EmailSchema):
    return await auth_service.send_registration_otp(data.email)

@router.post("/login", response_model=TokenResponse)
async def login(login_data: LoginSchema):
    return await auth_service.authenticate_user(login_data)

@router.post("/login-otp")
async def request_login_otp(data: EmailSchema):
    return await auth_service.send_login_otp(data)

@router.post("/verify-login-otp", response_model=TokenResponse)
async def verify_login_with_otp(data: OTPVerifySchema):
    return await auth_service.verify_login_otp(data)

@router.post("/token", response_model=TokenResponse)
async def login_swagger(form_data: OAuth2PasswordRequestForm = Depends()):
    return await auth_service.authenticate_user(LoginSchema(email=form_data.username, password=form_data.password))
