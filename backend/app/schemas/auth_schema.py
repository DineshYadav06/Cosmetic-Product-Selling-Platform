from pydantic import BaseModel, EmailStr

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str

class EmailSchema(BaseModel):
    email: EmailStr

class OTPVerifySchema(BaseModel):
    email: EmailStr
    otp: str
