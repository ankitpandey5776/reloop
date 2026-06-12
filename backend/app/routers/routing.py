from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.database import get_db
from app.models import Twin
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
    
    twin = Twin.get_by_id(db, twin_id)
    if not twin:
        raise HTTPException(status_code=404, detail={"error": {"code": "TWIN_NOT_FOUND", "message": "Twin not found."}})
        
    if twin.get("state") != "GRADED":
        raise HTTPException(status_code=409, detail={"error": {"code": "INVALID_STATE", "message": f"Expected GRADED, got {twin.get('state')}"}})
        
    # Call routing service
    routing_result = routing_service.route_item(twin)
    
    # Update DB
    updates = {
        "routing": routing_result.get("routing", {}),
        "credits": routing_result.get("credits", {}),
        "state": "ROUTED"
    }
    
    updated_twin = Twin.update(db, twin_id, updates)
    return updated_twin
