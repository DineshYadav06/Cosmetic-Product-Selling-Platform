from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings

from models.database import Base, engine
from models import user

from routes import auth, protected

# Create all database tables (SQLite generation)
# In production with Postgres, use Alembic for migrations instead
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="A complete Authentication system featuring JWT, Bcrypt, and OTP",
    version="1.0.0"
)

# CORS Middleware (Allows frontend React/NextJS to connect)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Change to specific domains in production (e.g. ["http://localhost:3000"])
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the routers from the routes folder
app.include_router(auth.router)
app.include_router(protected.router)

@app.get("/", tags=["Health Check"])
def root():
    return {
        "status": "online",
        "message": f"Welcome to {settings.PROJECT_NAME}. Go to /docs to see the APIs."
    }
