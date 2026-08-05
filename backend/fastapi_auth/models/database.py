from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from core.config import settings

# Engine configuration for SQLite (check_same_thread=False is needed in SQLite for FastAPI)
engine = create_engine(
    settings.DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to yield database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
