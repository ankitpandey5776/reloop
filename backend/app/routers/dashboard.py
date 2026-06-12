from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/api/v1/dashboard", tags=["Dashboard"])
analytics_service = AnalyticsService()

@router.get("/stats")
async def get_dashboard_stats(db: Session = Depends(get_db)):
    return analytics_service.get_dashboard_stats(db)

@router.get("/recent-twins")
async def get_recent_twins(limit: int = Query(10, ge=1, le=50), db: Session = Depends(get_db)):
    return {"twins": analytics_service.get_recent_twins(limit, db)}
