from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from app.services.prevention_service import PreventionService
from app.database import get_db, Twin
from datetime import datetime

router = APIRouter(prefix="/api/v1/prevention", tags=["Prevention"])
prevention_service = PreventionService()


class CheckRiskRequest(BaseModel):
    items: List[dict]
    customer_id: str


# ── EXISTING endpoint — untouched ─────────────────────────────────────────────
@router.post("/check-risk")
async def check_risk(request: CheckRiskRequest):
    return prevention_service.check_risk(request.items, request.customer_id)


# ── Feature 5: Record prevention outcome against the twin ─────────────────────
class RecordPreventionRequest(BaseModel):
    twin_id:    str
    risk_score: float
    risk_factors: List[str]
    nudge_shown:  bool
    nudge_type:   str
    prevented:    bool   # True = customer changed behaviour after nudge


@router.post("/record")
async def record_prevention(
    request: RecordPreventionRequest,
    db: Session = Depends(get_db)
):
    """
    Feature 5 — Persist prevention outcome to the twin's prevention_data.
    Called by the frontend after the customer responds to a nudge at checkout.
    This makes the dashboard 'returns_prevented' counter reflect real usage.
    """
    twin = db.query(Twin).filter(Twin.twin_id == request.twin_id).first()
    if not twin:
        from fastapi import HTTPException
        raise HTTPException(
            status_code=404,
            detail={"error": {"code": "TWIN_NOT_FOUND", "message": f"Twin {request.twin_id} not found"}}
        )

    twin.prevention_data = {
        "risk_score":   request.risk_score,
        "risk_factors": request.risk_factors,
        "nudge_shown":  request.nudge_shown,
        "nudge_type":   request.nudge_type,
        "prevented":    request.prevented,
    }
    twin.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(twin)

    return {
        "twin_id":   twin.twin_id,
        "prevented": request.prevented,
        "message":   "Prevention outcome recorded." + (" Return prevented — well done! 🌿" if request.prevented else ""),
    }
