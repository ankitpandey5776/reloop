from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db, Twin
from app.models import TwinCreate, TwinUpdate, TwinResponse, ItemInfo, CustomerInfo
from app.events import emit
from app.utils.helpers import generate_uuid, validate_state_transition
from datetime import datetime

router = APIRouter(prefix="/api/v1/twins", tags=["Twins"])

def _format_twin(twin: Twin) -> dict:
    return {
        "twin_id": twin.twin_id,
        "state": twin.state,
        "item": twin.item_data,
        "customer": twin.customer_data,
        "prevention": twin.prevention_data,
        "grading": twin.grading_data,
        "valuation": twin.valuation_data,
        "routing": twin.routing_data,
        "credits": twin.credits_data,
        "created_at": twin.created_at,
        "updated_at": twin.updated_at
    }

@router.post("/", response_model=TwinResponse)
async def create_twin(twin_data: TwinCreate, db: Session = Depends(get_db)):
    new_twin = Twin(
        twin_id=generate_uuid(),
        state="ACTIVE",
        item_data=twin_data.item.dict(),
        customer_data=twin_data.customer.dict(),
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(new_twin)
    db.commit()
    db.refresh(new_twin)
    
    result = _format_twin(new_twin)
    emit("twin.created", result)
    return result

@router.get("/{twin_id}", response_model=TwinResponse)
async def get_twin(twin_id: str, db: Session = Depends(get_db)):
    twin = db.query(Twin).filter(Twin.twin_id == twin_id).first()
    if not twin:
        raise HTTPException(status_code=404, detail={"error": {"code": "TWIN_NOT_FOUND", "message": f"Twin {twin_id} not found"}})
    return _format_twin(twin)

@router.get("/", response_model=List[TwinResponse])
async def list_twins(
    state: Optional[str] = None,
    category: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Twin)
    if state:
        query = query.filter(Twin.state == state)
    
    twins = query.order_by(Twin.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    
    results = []
    for t in twins:
        if category and t.item_data.get("category") != category:
            continue
        results.append(_format_twin(t))
    return results

@router.patch("/{twin_id}/state", response_model=TwinResponse)
async def update_twin_state(twin_id: str, update_data: TwinUpdate, db: Session = Depends(get_db)):
    twin = db.query(Twin).filter(Twin.twin_id == twin_id).first()
    if not twin:
        raise HTTPException(status_code=404, detail={"error": {"code": "TWIN_NOT_FOUND", "message": f"Twin {twin_id} not found"}})
    
    if not validate_state_transition(twin.state, update_data.state):
        raise HTTPException(status_code=409, detail={"error": {"code": "INVALID_STATE", "message": f"Expected valid transition from {twin.state}, got {update_data.state}"}})
        
    twin.state = update_data.state
    twin.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(twin)
    
    result = _format_twin(twin)
    emit("twin.state_changed", result)
    return result

@router.delete("/{twin_id}")
async def delete_twin(twin_id: str, db: Session = Depends(get_db)):
    twin = db.query(Twin).filter(Twin.twin_id == twin_id).first()
    if not twin:
        raise HTTPException(status_code=404, detail={"error": {"code": "TWIN_NOT_FOUND", "message": f"Twin {twin_id} not found"}})
    db.delete(twin)
    db.commit()
    return {"message": "Deleted"}
