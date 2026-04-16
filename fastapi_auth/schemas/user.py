from pydantic import BaseModel, EmailStr
from typing import Optional

# Input schema for registering a user
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

# Input schema for normal login
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Requesting an OTP to an email
class OTPRequest(BaseModel):
    email: EmailStr

# Verifying an OTP code sent to an email
class OTPVerify(BaseModel):
    email: EmailStr
    otp: str

# Data returning outward to the client (we shouldn't return passwords)
class UserResponse(BaseModel):
    id: int
    name: Optional[str]
    email: EmailStr
    is_active: bool

    class Config:
        from_attributes = True
