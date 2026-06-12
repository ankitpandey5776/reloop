from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ItemInfo(BaseModel):
    sku: str
    title: str
    category: str
    original_price: int
    purchase_date: str
    image_url: Optional[str] = None

class CustomerInfo(BaseModel):
    customer_id: str
    pincode: str
    name: str

class PreventionData(BaseModel):
    risk_score: float
    risk_factors: List[str]
    nudge_shown: bool
    nudge_type: str
    prevented: bool

class DefectInfo(BaseModel):
    type: str
    location: str
    severity: str

class GradingData(BaseModel):
    grade: str
    confidence: float
    defects: List[DefectInfo]
    photo_urls: List[str]
    condition_report: str
    graded_at: str

class ValuationData(BaseModel):
    resale_price: int
    price_multiplier: float
    demand_factor: float

class DestinationInfo(BaseModel):
    type: str
    name: str
    pincode: str

class SavingsInfo(BaseModel):
    cost_saved: int
    co2_saved_kg: float
    km_avoided: float

class RoutingData(BaseModel):
    decision: str
    reasoning: str
    destination: DestinationInfo
    savings: SavingsInfo
    routed_at: str

class CreditsData(BaseModel):
    earned: int
    action: str
    lifetime_credits: int

class TwinCreate(BaseModel):
    item: ItemInfo
    customer: CustomerInfo

class TwinUpdate(BaseModel):
    state: str

class TwinResponse(BaseModel):
    twin_id: str
    state: str
    item: ItemInfo
    customer: CustomerInfo
    prevention: Optional[PreventionData] = None
    grading: Optional[GradingData] = None
    valuation: Optional[ValuationData] = None
    routing: Optional[RoutingData] = None
    credits: Optional[CreditsData] = None
    created_at: datetime
    updated_at: datetime
