from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Any
from app.services.prevention_service import PreventionService

router = APIRouter(prefix="/api/v1/prevention", tags=["Prevention"])
prevention_service = PreventionService()

class CheckRiskRequest(BaseModel):
    items: List[dict]
    customer_id: str

@router.post("/check-risk")
async def check_risk(request: CheckRiskRequest):
    return prevention_service.check_risk(request.items, request.customer_id)
