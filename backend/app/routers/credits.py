from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.credits_service import CreditsService

router = APIRouter(prefix="/api/v1/credits", tags=["Credits"])
credits_service = CreditsService()

@router.get("/{customer_id}")
async def get_customer_credits(customer_id: str, db: Session = Depends(get_db)):
    result = credits_service.get_customer_credits(customer_id, db)
    return result
