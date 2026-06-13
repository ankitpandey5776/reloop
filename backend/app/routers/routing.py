from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.database import get_db, Twin
from app.services.routing_service import routing_service

router = APIRouter(prefix="/api/v1/routing", tags=["routing"])

class RouteRequest(BaseModel):
    twin_id: str

@router.post("/route")
async def route(
    request: RouteRequest,
    db = Depends(get_db)
):
    """
    Determines the best route for an item based on its grade, generates AI reasoning, and calculates savings.
    """
    twin_id = request.twin_id
    
    twin = db.query(Twin).filter(Twin.twin_id == twin_id).first()
    if not twin:
        raise HTTPException(status_code=404, detail={"error": {"code": "TWIN_NOT_FOUND", "message": "Twin not found."}})
        
    if twin.state != "GRADED":
        raise HTTPException(status_code=409, detail={"error": {"code": "INVALID_STATE", "message": f"Expected GRADED, got {twin.state}"}})
        
    # Construct a dict for routing service which expects dicts
    twin_dict = {
        "twin_id": twin.twin_id,
        "item": twin.item_data,
        "customer": twin.customer_data,
        "grading": twin.grading_data,
        "valuation": twin.valuation_data,
        "state": twin.state
    }
    # Call routing service
    routing_result = routing_service.route_item(twin_dict)
    
    # Update DB
    twin.routing_data = routing_result.get("routing", {})
    twin.credits_data = routing_result.get("credits", {})
    twin.state = "ROUTED"
    
    db.commit()
    db.refresh(twin)
    return twin
