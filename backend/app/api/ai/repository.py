from app.utils.repository import BaseRepository
from app.models.analysis_model import AnalysisHistory

class AnalysisRepository(BaseRepository[AnalysisHistory, dict, dict]):
    async def get_by_user(self, user_id: str):
        return await self.model.find(self.model.user.id == user_id).to_list()

analysis_repository = AnalysisRepository(AnalysisHistory)
