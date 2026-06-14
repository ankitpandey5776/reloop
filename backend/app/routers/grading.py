import os
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from typing import List
from app.database import get_db, Twin
from app.services.grading_service import grading_service
from app.services.valuation_service import valuation_service

router = APIRouter(prefix="/api/v1/grading", tags=["grading"])

MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024
ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]

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
    
    return twin
