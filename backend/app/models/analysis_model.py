from beanie import Document, Link
from pydantic import Field
from datetime import datetime, timezone
from app.models.user_model import User

class AnalysisHistory(Document):
    user: Link[User]
    image_url: str
    skin_type_result: str
    confidence_score: float
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "analysis_history"
