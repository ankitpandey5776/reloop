import json
import random
import uuid
from datetime import datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Twin, Base
from app.config import get_settings

settings = get_settings()
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

def random_date(days_ago=30):
    start = datetime.utcnow() - timedelta(days=days_ago)
    return start + timedelta(seconds=random.randint(0, days_ago * 24 * 60 * 60))

def generate_synthetic_data():
    Base.metadata.create_all(engine)
    
    # Check if we already have data
    if db.query(Twin).count() > 0:
        print("Database already contains data. Skipping generation.")
        return

    items_pool = [
        {"sku": "ELEC-S23", "title": "Samsung Galaxy S23 (256GB)", "category": "electronics", "original_price": 74999},
        {"sku": "ELEC-BOAT", "title": "boAt Airdopes 141", "category": "electronics", "original_price": 1299},
        {"sku": "FASH-ALNS", "title": "Allen Solly Men's Slim Fit Shirt", "category": "fashion", "original_price": 1299},
        {"sku": "FASH-NIKE", "title": "Nike Revolution 6 Running Shoes", "category": "fashion", "original_price": 3695},
        {"sku": "HOME-PRES", "title": "Prestige Induction Cooktop", "category": "home", "original_price": 2499},
        {"sku": "HOME-PIG", "title": "Pigeon Mixer Grinder", "category": "home", "original_price": 1899},
        {"sku": "BOOK-HP", "title": "Harry Potter Box Set", "category": "books", "original_price": 2500},
        {"sku": "ELEC-KIND", "title": "Amazon Kindle Paperwhite", "category": "electronics", "original_price": 13999},
    ]

    pincodes = ["700001", "400001", "560001", "110001", "600001"]
    
    # Distribute states: 15 ACTIVE, 10 RETURN_INTENT, 10 GRADED, 10 ROUTED, 10 LISTED, 5 SOLD, 5 DONATED, 5 RECYCLED
    states_to_generate = (
        ["ACTIVE"] * 15 +
        ["RETURN_INTENT"] * 10 +
        ["GRADED"] * 10 +
        ["ROUTED"] * 10 +
        ["LISTED"] * 10 +
        ["SOLD"] * 5 +
        ["DONATED"] * 5 +
        ["RECYCLED"] * 5
    )
    
    twins_created = 0
    
    for state in states_to_generate:
        item_template = random.choice(items_pool)
        twin_id = str(uuid.uuid4())
        created_dt = random_date()
        
        item_data = {
            "sku": item_template["sku"],
            "title": item_template["title"],
            "category": item_template["category"],
            "original_price": item_template["original_price"],
            "purchase_date": (created_dt - timedelta(days=random.randint(1, 10))).isoformat(),
            "image_url": None
        }
        
        customer_data = {
            "customer_id": f"cust-{random.randint(1000, 9999)}",
            "pincode": random.choice(pincodes),
            "name": f"Customer {random.randint(1, 100)}"
        }
        
        prevention_data = None
        grading_data = None
        valuation_data = None
        routing_data = None
        credits_data = None
        
        # Simulate prevention logic
        if random.random() < 0.2:
            prevention_data = {
                "risk_score": round(random.uniform(0.6, 0.95), 2),
                "risk_factors": ["high_return_category"],
                "nudge_shown": True,
                "nudge_type": "fit_predictor",
                "prevented": random.random() < 0.5
            }
        
        if state in ["GRADED", "ROUTED", "LISTED", "SOLD", "DONATED", "RECYCLED"]:
            grade = random.choice(["A", "B", "C", "D"])
            multiplier = {"A": 0.85, "B": 0.70, "C": 0.50, "D": 0.20}[grade]
            
            grading_data = {
                "grade": grade,
                "confidence": round(random.uniform(0.8, 0.99), 2),
                "defects": [],
                "photo_urls": [],
                "condition_report": f"Item appears to be in {grade} condition.",
                "graded_at": (created_dt + timedelta(hours=1)).isoformat()
            }
            
            valuation_data = {
                "resale_price": int(item_data["original_price"] * multiplier),
                "price_multiplier": multiplier,
                "demand_factor": 1.0
            }
            
        if state in ["ROUTED", "LISTED", "SOLD", "DONATED", "RECYCLED"]:
            if grade == "A" or grade == "B":
                decision = random.choice(["RESELL_P2P", "RESELL_RENEWED"])
            elif grade == "C":
                decision = random.choice(["REFURBISH", "DONATE"])
            else:
                decision = "RECYCLE"
                
            routing_data = {
                "decision": decision,
                "reasoning": "Optimal path based on condition and local demand.",
                "destination": {
                    "type": "buyer" if "P2P" in decision else "facility",
                    "name": "Local Destination",
                    "pincode": customer_data["pincode"]
                },
                "savings": {
                    "cost_saved": random.randint(100, 300),
                    "co2_saved_kg": round(random.uniform(0.5, 5.0), 2),
                    "km_avoided": round(random.uniform(10, 500), 1)
                },
                "routed_at": (created_dt + timedelta(hours=2)).isoformat()
            }
            
            credits_data = {
                "earned": random.randint(20, 50),
                "action": "routed_optimally",
                "lifetime_credits": random.randint(50, 500)
            }
            
        twin = Twin(
            twin_id=twin_id,
            state=state,
            item_data=item_data,
            customer_data=customer_data,
            prevention_data=prevention_data,
            grading_data=grading_data,
            valuation_data=valuation_data,
            routing_data=routing_data,
            credits_data=credits_data,
            created_at=created_dt,
            updated_at=created_dt + timedelta(days=1)
        )
        db.add(twin)
        twins_created += 1
        
    db.commit()
    print(f"Successfully generated {twins_created} synthetic twins!")

if __name__ == "__main__":
    generate_synthetic_data()
