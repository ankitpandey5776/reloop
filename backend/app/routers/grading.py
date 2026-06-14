import os
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db, Twin
from app.services.grading_service import grading_service
from app.services.valuation_service import valuation_service

router = APIRouter(prefix="/api/v1/grading", tags=["grading"])

MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024
ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]


def _serialize_grading(twin: Twin) -> dict:
    """Return a safe dict response for grading endpoints."""
    return {
        "twin_id":   twin.twin_id,
        "state":     twin.state,
        "item":      twin.item_data,
        "grading":   twin.grading_data,
        "valuation": twin.valuation_data,
        "created_at": twin.created_at.isoformat() if isinstance(twin.created_at, datetime) else twin.created_at,
        "updated_at": twin.updated_at.isoformat() if isinstance(twin.updated_at, datetime) else twin.updated_at,
    }


@router.get("/status/{twin_id}")
async def grading_status(twin_id: str, db: Session = Depends(get_db)):
    """
    Feature 3 — Grading status polling endpoint.
    Frontend polls this while waiting for grading to complete.
    Returns current state + grading data if ready.
    """
    twin = db.query(Twin).filter(Twin.twin_id == twin_id).first()
    if not twin:
        raise HTTPException(
            status_code=404,
            detail={"error": {"code": "TWIN_NOT_FOUND", "message": "Twin not found."}}
        )

    ready    = twin.state in ("GRADED", "ROUTED", "LISTED", "SOLD", "DONATED", "RECYCLED")
    pending  = twin.state in ("ACTIVE", "RETURN_INTENT")
    rejected = (twin.grading_data or {}).get("grade") == "F"

    return {
        "twin_id":  twin.twin_id,
        "state":    twin.state,
        "ready":    ready,
        "pending":  pending,
        "rejected": rejected,
        "grading":  twin.grading_data,
        "valuation": twin.valuation_data,
        "condition_hash": (twin.grading_data or {}).get("condition_hash"),
    }

@router.post("/grade")
async def grade(
    twin_id: str = Form(...),
    photos: List[UploadFile] = File(...),
    db = Depends(get_db)
):
    """
    Grades an item based on photos, updates the twin's state, grading, and valuation.
    """
    if len(photos) < 1 or len(photos) > 4:
        raise HTTPException(status_code=400, detail={"error": {"code": "INVALID_IMAGE_COUNT", "message": "Provide 1 to 4 photos."}})
        
    photo_bytes_list = []
    photo_urls = []
    
    upload_dir = os.path.join("uploads", twin_id)
    os.makedirs(upload_dir, exist_ok=True)
    
    for i, photo in enumerate(photos):
        if photo.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(status_code=400, detail={"error": {"code": "INVALID_IMAGE_TYPE", "message": f"File {photo.filename} is not supported."}})
            
        file_bytes = await photo.read()
        if len(file_bytes) > MAX_IMAGE_SIZE_BYTES:
            raise HTTPException(status_code=400, detail={"error": {"code": "IMAGE_TOO_LARGE", "message": f"File {photo.filename} exceeds 10MB limit."}})
            
        photo_bytes_list.append(file_bytes)
        
        # Save to disk
        file_path = os.path.join(upload_dir, photo.filename)
        with open(file_path, "wb") as f:
            f.write(file_bytes)
            
        photo_urls.append(f"/uploads/{twin_id}/{photo.filename}")

    # Fetch twin
    twin = db.query(Twin).filter(Twin.twin_id == twin_id).first()
    if not twin:
        raise HTTPException(status_code=404, detail={"error": {"code": "TWIN_NOT_FOUND", "message": "Twin not found."}})
        
    if twin.state != "RETURN_INTENT" and twin.state != "ACTIVE":
        raise HTTPException(status_code=409, detail={"error": {"code": "INVALID_STATE", "message": f"Expected RETURN_INTENT or ACTIVE, got {twin.state}"}})
        
    # Grading Service
    item_info = twin.item_data or {}
    grading_result = grading_service.grade_item(photo_bytes_list, item_info)
    grading_result["photo_urls"] = photo_urls
    
    # Valuation Service — strip to schema-defined fields only
    grade = grading_result.get("grade", "B")
    valuation_full = valuation_service.calculate_value(
        grade,
        item_info.get("original_price", 0),
        item_info.get("category", "other")
    )
    valuation_result = {
        "resale_price": valuation_full["resale_price"],
        "price_multiplier": valuation_full["price_multiplier"],
        "demand_factor": valuation_full["demand_factor"],
    }
    
    # Update DB
    twin.grading_data = grading_result
    twin.valuation_data = valuation_result
    twin.state = "GRADED"
    db.commit()
    db.refresh(twin)

    return _serialize_grading(twin)
