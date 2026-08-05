from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """
    Application wide settings loaded from environment variables (.env file).
    """
    PROJECT_NAME: str = "FastAPI Authentication System"
    
    # DB configuration
    DATABASE_URL: str = "sqlite:///./auth.db"
    
    # JWT configuration
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # OTP configuration
    OTP_EXPIRE_MINUTES: int = 5

    class Config:
        env_file = ".env"

# Instantiate settings to be imported across the app
settings = Settings()
