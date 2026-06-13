from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.models import Twin

router = APIRouter(prefix="/api/v1/marketplace", tags=["marketplace"])

class ListRequest(BaseModel):
    twin_id: str

class BuyRequest(BaseModel):
    twin_id: str
    buyer_id: str

@router.get("/listings")
async def get_listings(
    category: Optional[str] = None,
    grade: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db = Depends(get_db)
):
    """
    Returns twins with state=LISTED, sorted by created_at desc
    """
    all_twins = Twin.get_all(db)
    
    # Filter by state = LISTED
    # Mock fallback, in real app this is a DB query
    listed_twins = [t for t in all_twins if t.get("state") == "LISTED"]
    
    if category:
        listed_twins = [t for t in listed_twins if t.get("item", {}).get("category") == category]
        
    if grade:
        listed_twins = [t for t in listed_twins if t.get("grading", {}).get("grade") == grade]
        
    # Sort
    listed_twins.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    
    # Paginate
    start = (page - 1) * limit
    end = start + limit
    paginated_twins = listed_twins[start:end]
    
    return {
        "listings": paginated_twins,
        "total": len(listed_twins),
        "page": page
    }

@router.get("/listings/{twin_id}")
async def get_listing(twin_id: str, db = Depends(get_db)):
    """
    Returns full twin detail for a specific listing
    """
    twin = Twin.get_by_id(db, twin_id)
    if not twin or twin.get("state") != "LISTED":
        raise HTTPException(status_code=404, detail={"error": {"code": "LISTING_NOT_FOUND", "message": "Listing not found or not active."}})
        
    return twin

@router.post("/list")
async def list_item(request: ListRequest, db = Depends(get_db)):
    """
    Move ROUTED twin to LISTED
    """
    twin_id = request.twin_id
    twin = Twin.get_by_id(db, twin_id)
    
    if not twin:
        raise HTTPException(status_code=404, detail={"error": {"code": "TWIN_NOT_FOUND", "message": "Twin not found."}})
        
    if twin.get("state") != "ROUTED":
        raise HTTPException(status_code=409, detail={"error": {"code": "INVALID_STATE", "message": f"Expected ROUTED, got {twin.get('state')}"}})
        
    decision = twin.get("routing", {}).get("decision")
    if decision not in ["RESELL_P2P", "RESELL_RENEWED"]:
        raise HTTPException(status_code=400, detail={"error": {"code": "INVALID_DECISION", "message": f"Cannot list item with decision {decision}"}})
        
    # Update state to LISTED
    updates = {"state": "LISTED"}
    updated_twin = Twin.update(db, twin_id, updates)
    
    return {
        "twin_id": twin_id,
        "state": "LISTED",
        "listing_url": f"/marketplace/{twin_id}"
    }

@router.post("/buy")
async def buy_item(request: BuyRequest, db = Depends(get_db)):
    """
    Move LISTED twin to SOLD
    """
    twin_id = request.twin_id
    buyer_id = request.buyer_id
    
    twin = Twin.get_by_id(db, twin_id)
    if not twin:
        raise HTTPException(status_code=404, detail={"error": {"code": "TWIN_NOT_FOUND", "message": "Twin not found."}})
        
    if twin.get("state") != "LISTED":
        raise HTTPException(status_code=409, detail={"error": {"code": "INVALID_STATE", "message": f"Expected LISTED, got {twin.get('state')}"}})
        
    # Update state to SOLD
    # We would also store buyer_id in a real DB
    updates = {"state": "SOLD"}
    updated_twin = Twin.update(db, twin_id, updates)
    
    savings = twin.get("routing", {}).get("savings", {})
    return {
        "twin_id": twin_id,
        "state": "SOLD",
        "cost_saved": savings.get("cost_saved", 0),
        "co2_saved_kg": savings.get("co2_saved_kg", 0)
    }
