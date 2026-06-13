from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.database import get_db, Twin

router = APIRouter(prefix="/api/v1/marketplace", tags=["marketplace"])


class ListRequest(BaseModel):
    twin_id: str


class BuyRequest(BaseModel):
    twin_id: str
    buyer_id: str


def _format_twin(twin: Twin) -> dict:
    """Serialize a SQLAlchemy Twin ORM object to a plain dict for API responses."""
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
        "created_at": twin.created_at.isoformat() if isinstance(twin.created_at, datetime) else twin.created_at,
        "updated_at": twin.updated_at.isoformat() if isinstance(twin.updated_at, datetime) else twin.updated_at,
    }


@router.get("/listings")
async def get_listings(
    category: Optional[str] = None,
    grade: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Returns twins with state=LISTED, filtered by optional category/grade,
    sorted by created_at desc, with pagination.
    """
    query = db.query(Twin).filter(Twin.state == "LISTED")

    # Pull all matching rows then filter JSON sub-fields in Python
    # (SQLite JSON indexing is limited; acceptable for hackathon scale)
    all_listed = query.order_by(Twin.created_at.desc()).all()

    results = []
    for twin in all_listed:
        if category and (twin.item_data or {}).get("category") != category:
            continue
        if grade and (twin.grading_data or {}).get("grade") != grade:
            continue
        results.append(_format_twin(twin))

    total = len(results)
    start = (page - 1) * limit
    paginated = results[start: start + limit]

    return {
        "listings": paginated,
        "total": total,
        "page": page
    }


@router.get("/listings/{twin_id}")
async def get_listing(twin_id: str, db: Session = Depends(get_db)):
    """
    Returns full twin detail for a specific listing.
    404 if twin does not exist or is not in LISTED state.
    """
    twin = db.query(Twin).filter(Twin.twin_id == twin_id).first()
    if not twin or twin.state != "LISTED":
        raise HTTPException(
            status_code=404,
            detail={"error": {"code": "LISTING_NOT_FOUND", "message": "Listing not found or not active."}}
        )
    return _format_twin(twin)


@router.post("/list")
async def list_item(request: ListRequest, db: Session = Depends(get_db)):
    """
    Move a ROUTED twin to LISTED state.
    Only twins with decision RESELL_P2P or RESELL_RENEWED can be listed.
    """
    twin = db.query(Twin).filter(Twin.twin_id == request.twin_id).first()

    if not twin:
        raise HTTPException(
            status_code=404,
            detail={"error": {"code": "TWIN_NOT_FOUND", "message": "Twin not found."}}
        )

    if twin.state != "ROUTED":
        raise HTTPException(
            status_code=409,
            detail={"error": {"code": "INVALID_STATE", "message": f"Expected ROUTED, got {twin.state}"}}
        )

    decision = (twin.routing_data or {}).get("decision")
    if decision not in ["RESELL_P2P", "RESELL_RENEWED"]:
        raise HTTPException(
            status_code=400,
            detail={"error": {"code": "INVALID_DECISION", "message": f"Cannot list item with decision {decision}"}}
        )

    twin.state = "LISTED"
    twin.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(twin)

    return {
        "twin_id": twin.twin_id,
        "state": "LISTED",
        "listing_url": f"/marketplace/{twin.twin_id}"
    }


@router.post("/buy")
async def buy_item(request: BuyRequest, db: Session = Depends(get_db)):
    """
    Move a LISTED twin to SOLD state.
    Returns savings summary for the buyer confirmation screen.
    """
    twin = db.query(Twin).filter(Twin.twin_id == request.twin_id).first()

    if not twin:
        raise HTTPException(
            status_code=404,
            detail={"error": {"code": "TWIN_NOT_FOUND", "message": "Twin not found."}}
        )

    if twin.state != "LISTED":
        raise HTTPException(
            status_code=409,
            detail={"error": {"code": "INVALID_STATE", "message": f"Expected LISTED, got {twin.state}"}}
        )

    twin.state = "SOLD"
    twin.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(twin)

    savings = (twin.routing_data or {}).get("savings", {})
    return {
        "twin_id": twin.twin_id,
        "state": "SOLD",
        "cost_saved": savings.get("cost_saved", 0),
        "co2_saved_kg": savings.get("co2_saved_kg", 0)
    }
