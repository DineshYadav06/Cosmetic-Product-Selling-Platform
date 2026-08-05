from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Glowmart API"
    MONGODB_URI: str = "mongodb://localhost:27017" # Fallback
    MONGODB_DB_NAME: str = "glowmart"
    SECRET_KEY: str = "supersecretkey_please_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    EMAIL_ID: str = ""
    EMAIL_SECRET: str = ""
    GEMINI_API_KEY: str = ""
    
    class Config:
        env_file = ".env"

settings = Settings()
