from fastapi import APIRouter, Depends
from app.dependencies.roles import require_role
from app.api.dashboard.service import dashboard_service

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats", dependencies=[Depends(require_role("ADMIN"))])
async def get_dashboard_stats():
    return await dashboard_service.get_stats()
