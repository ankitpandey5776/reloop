"""
Synthetic data generator for ReLoop demo.
Generates 70 realistic twins across all states with full Indian product data.

Run from backend/ directory:
    python -m seed_data.generate_synthetic

To reset and regenerate:
    python -m seed_data.generate_synthetic --reset
"""

import json
import random
import uuid
import sys
from datetime import datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Twin, Base
from app.config import get_settings

settings = get_settings()
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

RESET = "--reset" in sys.argv

def random_date(days_ago=30):
    start = datetime.utcnow() - timedelta(days=days_ago)
    return start + timedelta(seconds=random.randint(0, days_ago * 24 * 60 * 60))

# Rich realistic Indian product pool
ITEMS_POOL = [
    {"sku": "ELEC-SAM-S23",  "title": "Samsung Galaxy S23 (256GB, Phantom Black)",   "category": "electronics", "original_price": 74999},
    {"sku": "ELEC-BOAT-141", "title": "boAt Airdopes 141 True Wireless Earbuds",      "category": "electronics", "original_price": 1299},
    {"sku": "ELEC-KIND-PW",  "title": "Amazon Kindle Paperwhite (16GB, 2023)",        "category": "electronics", "original_price": 13999},
    {"sku": "ELEC-FIRE-4K",  "title": "Fire TV Stick 4K Max (Wi-Fi 6)",               "category": "electronics", "original_price": 6999},
    {"sku": "ELEC-IPAD-10",  "title": "Apple iPad 10th Gen (64GB, Wi-Fi)",            "category": "electronics", "original_price": 44900},
    {"sku": "ELEC-BOAT-RK",  "title": "boAt Rockerz 450 Bluetooth Headphones",        "category": "electronics", "original_price": 899},
    {"sku": "FASH-ALNS-SHT", "title": "Allen Solly Men Slim Fit Casual Shirt (L)",   "category": "fashion",     "original_price": 1299},
    {"sku": "FASH-NIKE-REV", "title": "Nike Revolution 6 Running Shoes (UK 9)",       "category": "fashion",     "original_price": 3695},
    {"sku": "FASH-LEV-JNS",  "title": "Levi's 511 Slim Fit Jeans (32x30, Blue)",      "category": "fashion",     "original_price": 2999},
    {"sku": "FASH-PUMA-TRK", "title": "Puma Men's Track Pants (M, Black)",            "category": "fashion",     "original_price": 1499},
    {"sku": "HOME-PRES-IND", "title": "Prestige Induction Cooktop (1600W)",           "category": "home",        "original_price": 2499},
    {"sku": "HOME-PIG-MXR",  "title": "Pigeon Mixer Grinder 750W (3 Jars)",           "category": "home",        "original_price": 1899},
    {"sku": "HOME-PHIL-AIR", "title": "Philips Air Purifier AC1215 (333 sqft)",       "category": "home",        "original_price": 8999},
    {"sku": "HOME-WIP-BLB",  "title": "Wipro 9W LED Bulb Smart (Pack of 4)",          "category": "home",        "original_price": 699},
    {"sku": "BOOK-HP-SET",   "title": "Harry Potter Complete 7-Book Box Set",         "category": "books",       "original_price": 2500},
    {"sku": "BOOK-ATMT",     "title": "Atomic Habits by James Clear",                 "category": "books",       "original_price": 399},
    {"sku": "BOOK-ZERO",     "title": "Zero to One by Peter Thiel",                   "category": "books",       "original_price": 350},
]

# Indian city pincodes with names for realism
LOCATIONS = [
    {"pincode": "700001", "city": "Kolkata"},
    {"pincode": "400001", "city": "Mumbai"},
    {"pincode": "560001", "city": "Bangalore"},
    {"pincode": "110001", "city": "Delhi"},
    {"pincode": "600001", "city": "Chennai"},
    {"pincode": "500001", "city": "Hyderabad"},
    {"pincode": "380001", "city": "Ahmedabad"},
    {"pincode": "411001", "city": "Pune"},
]

CUSTOMER_NAMES = [
    "Rahul Sharma", "Priya Patel", "Arjun Singh", "Neha Gupta", "Amit Kumar",
    "Sunita Joshi", "Vikram Nair", "Ananya Reddy", "Rohan Mehta", "Kavya Iyer",
    "Deepak Verma", "Sneha Pillai", "Aditya Rao", "Pooja Banerjee", "Sanjay Das",
    "Meera Krishnan", "Kiran Mishra", "Tanya Dubey", "Rajan Pandey", "Shreya Bose",
]

GRADE_MULTIPLIERS = {"A": 0.85, "B": 0.70, "C": 0.50, "D": 0.20}
CATEGORY_DEMAND  = {"electronics": 1.1, "fashion": 0.9, "home": 1.0, "books": 0.8, "other": 0.7}

CONDITION_REPORTS = {
    "A": [
        "Item is in pristine, like-new condition with no visible defects. Original packaging intact. Ready for immediate resale.",
        "Excellent condition — no scratches, dents, or wear marks. Functions perfectly. Could pass as brand new.",
        "Like-new condition. All accessories included, original box present. High-value resale candidate.",
    ],
    "B": [
        "Item shows minor signs of use but is in good working condition. Light scratches on the surface are cosmetic only.",
        "Good condition with minor cosmetic wear. Fully functional. A great second-life find.",
        "Some light scuffs near the edges but overall well-maintained. No functional issues detected.",
    ],
    "C": [
        "Noticeable wear and cosmetic damage but still functional. Suitable for refurbishment or budget-conscious buyers.",
        "Fair condition — visible scratches and one small dent on the side. Works correctly.",
        "Moderate wear throughout. Functional but would benefit from light refurbishment before resale.",
    ],
    "D": [
        "Significant damage including cracked casing and missing components. Salvage/parts value only.",
        "Heavy wear and structural damage. Non-functional — suitable for recycling or parts.",
        "Major defects present. Item does not power on. Recommended for responsible recycling.",
    ],
}

ROUTING_REASONING = {
    "RESELL_P2P":    "Your item is in great shape and there's local demand nearby — a direct peer-to-peer sale keeps the item in circulation and saves significant CO₂ vs. a warehouse round-trip.",
    "RESELL_RENEWED":"Sending to Amazon Renewed FC ensures a professionally verified listing reaches the right buyer nationally, maximising recovery value while avoiding unnecessary local logistics.",
    "REFURBISH":     "A certified repair partner nearby can restore this item to near-new condition for a fraction of the original cost, giving it a full second life and keeping it out of landfill.",
    "DONATE":        "This item will go directly to a local NGO partner, helping someone in need while avoiding transportation emissions — and you earn the most green credits for this route.",
    "RECYCLE":       "The item has reached end-of-usable life, but responsible recycling recovers raw materials and prevents harmful e-waste — the most sustainable path forward.",
}

DESTINATION_MAP = {
    "RESELL_P2P":    {"type": "buyer",              "name": "Local P2P Buyer Match"},
    "RESELL_RENEWED":{"type": "fulfillment_center", "name": "Amazon Renewed FC", "pincode": "400001"},
    "REFURBISH":     {"type": "refurbisher",         "name": "Certified Repair Partner", "pincode": "560001"},
    "DONATE":        {"type": "ngo",                 "name": "GreenHands Foundation"},
    "RECYCLE":       {"type": "recycler",            "name": "EcoRecycle India", "pincode": "411001"},
}

ROUTE_COSTS = {"RESELL_P2P": 80, "RESELL_RENEWED": 200, "REFURBISH": 150, "DONATE": 50, "RECYCLE": 30}
CREDIT_VALUES = {"RESELL_P2P": 50, "RESELL_RENEWED": 30, "REFURBISH": 25, "DONATE": 40, "RECYCLE": 20}

KM_RANGES = {
    "RESELL_P2P":    (10,  100),   # local area, vs baseline 500-800km warehouse trip
    "RESELL_RENEWED":(300,  800),
    "REFURBISH":     (150,  500),
    "DONATE":        (10,   50),
    "RECYCLE":       (10,   30),
}


def pick_decision(grade: str, resale_price: int, demand_factor: float) -> str:
    if grade == "A":
        return "RESELL_P2P" if demand_factor >= 1.0 else "RESELL_RENEWED"
    elif grade == "B":
        return "RESELL_P2P" if resale_price > 500 else "REFURBISH"
    elif grade == "C":
        return "DONATE"
    else:
        return "RECYCLE"


def make_twin(state: str) -> Twin:
    item_tpl  = random.choice(ITEMS_POOL)
    loc       = random.choice(LOCATIONS)
    name      = random.choice(CUSTOMER_NAMES)
    twin_id   = str(uuid.uuid4())
    created   = random_date(days_ago=45)

    item_data = {
        "sku": item_tpl["sku"],
        "title": item_tpl["title"],
        "category": item_tpl["category"],
        "original_price": item_tpl["original_price"],
        "purchase_date": (created - timedelta(days=random.randint(1, 14))).isoformat(),
        "image_url": None,
    }

    customer_data = {
        "customer_id": f"cust-{random.randint(1000, 9999)}",
        "pincode": loc["pincode"],
        "name": name,
    }

    prevention_data = None
    grading_data    = None
    valuation_data  = None
    routing_data    = None
    credits_data    = None

    # ── Prevention (20% of twins had a nudge shown) ──────────────────────────
    if random.random() < 0.25:
        prevented = random.random() < 0.45
        prevention_data = {
            "risk_score": round(random.uniform(0.55, 0.95), 2),
            "risk_factors": random.sample(
                ["size_bracketing", "high_return_category", "impulse_buy_risk", "medium_return_category"],
                k=random.randint(1, 2)
            ),
            "nudge_shown": True,
            "nudge_type": random.choice(["size_suggestion", "fit_predictor", "keep_discount"]),
            "prevented": prevented,
        }

    # ── Grading ────────────────────────────────────────────────────────────────
    if state in ["GRADED", "ROUTED", "LISTED", "SOLD", "DONATED", "RECYCLED"]:
        grade = random.choice(["A", "A", "B", "B", "B", "C", "D"])  # weighted toward B
        defects = []
        if grade in ("B", "C"):
            defects = [{
                "type": random.choice(["scratch", "dent", "stain", "discoloration"]),
                "location": random.choice(["front panel", "back cover", "corner", "screen edge", "surface"]),
                "severity": "minor" if grade == "B" else "moderate",
            }]
        if grade == "D":
            defects = [{
                "type": random.choice(["dent", "missing_part", "packaging_damage"]),
                "location": "main body",
                "severity": "major",
            }]

        grading_data = {
            "grade": grade,
            "confidence": round(random.uniform(0.82, 0.98), 2),
            "defects": defects,
            "photo_urls": [],
            "condition_report": random.choice(CONDITION_REPORTS[grade]),
            "graded_at": (created + timedelta(hours=random.randint(1, 6))).isoformat(),
            "is_authentic": True,
            "is_blurry": False,
            "fraud_reason": "",
        }

        demand_factor  = CATEGORY_DEMAND.get(item_tpl["category"], 1.0)
        multiplier     = GRADE_MULTIPLIERS[grade]
        resale_price   = int(item_tpl["original_price"] * multiplier * demand_factor)

        valuation_data = {
            "resale_price": resale_price,
            "price_multiplier": multiplier,
            "demand_factor": demand_factor,
        }

    # ── Routing ────────────────────────────────────────────────────────────────
    if state in ["ROUTED", "LISTED", "SOLD", "DONATED", "RECYCLED"]:
        decision   = pick_decision(grade, resale_price, demand_factor)
        km_avoided = random.randint(*KM_RANGES[decision])
        cost_saved = 350 - ROUTE_COSTS[decision]
        # CO2: baseline national return round-trip (~600km) vs actual route
        baseline_km  = random.randint(400, 800)
        net_km_saved = max(baseline_km - km_avoided, km_avoided)
        co2_saved_kg = round(net_km_saved * 0.21, 2)  # 0.21 kg per km road freight

        dest = dict(DESTINATION_MAP[decision])
        if decision in ("RESELL_P2P", "DONATE"):
            nearby = str(int(loc["pincode"]) + random.randint(1, 15))
            dest["pincode"] = nearby

        routing_data = {
            "decision": decision,
            "reasoning": ROUTING_REASONING[decision],
            "destination": dest,
            "savings": {
                "cost_saved": cost_saved,
                "co2_saved_kg": co2_saved_kg,
                "km_avoided": km_avoided,
            },
            "routed_at": (created + timedelta(hours=random.randint(6, 24))).isoformat(),
        }

        earned = CREDIT_VALUES[decision]
        credits_data = {
            "earned": earned,
            "action": decision.lower(),
            "lifetime_credits": earned + random.randint(0, 400),
        }

    return Twin(
        twin_id=twin_id,
        state=state,
        item_data=item_data,
        customer_data=customer_data,
        prevention_data=prevention_data,
        grading_data=grading_data,
        valuation_data=valuation_data,
        routing_data=routing_data,
        credits_data=credits_data,
        created_at=created,
        updated_at=created + timedelta(hours=random.randint(1, 48)),
    )


def generate_synthetic_data():
    Base.metadata.create_all(engine)

    existing = db.query(Twin).count()
    if existing > 0 and not RESET:
        print(f"Database already has {existing} twins. Use --reset to regenerate.")
        return

    if RESET:
        deleted = db.query(Twin).delete()
        db.commit()
        print(f"Reset: deleted {deleted} existing twins.")

    # State distribution chosen for maximum visual impact on dashboard
    state_plan = (
        ["ACTIVE"]        * 15 +
        ["RETURN_INTENT"] * 10 +
        ["GRADED"]        * 10 +
        ["ROUTED"]        * 10 +
        ["LISTED"]        * 12 +
        ["SOLD"]          * 8  +
        ["DONATED"]       * 5  +
        ["RECYCLED"]      * 5
    )
    random.shuffle(state_plan)

    created_count = 0
    for state in state_plan:
        twin = make_twin(state)
        db.add(twin)
        created_count += 1

    db.commit()

    # Print summary
    from sqlalchemy import func
    states = db.query(Twin.state, func.count(Twin.twin_id)).group_by(Twin.state).all()
    total_saved  = sum(
        (t.routing_data or {}).get("savings", {}).get("cost_saved", 0)
        for t in db.query(Twin).all() if t.routing_data
    )
    total_co2 = sum(
        (t.routing_data or {}).get("savings", {}).get("co2_saved_kg", 0.0)
        for t in db.query(Twin).all() if t.routing_data
    )
    prevented = sum(
        1 for t in db.query(Twin).all()
        if t.prevention_data and t.prevention_data.get("prevented")
    )

    print(f"\n✅ Generated {created_count} synthetic twins")
    print(f"\nState distribution:")
    for s, cnt in sorted(states, key=lambda x: x[1], reverse=True):
        print(f"  {s:<16}: {cnt}")
    print(f"\nDashboard preview:")
    print(f"  💰 Total cost saved : ₹{total_saved:,}")
    print(f"  🌿 CO₂ saved        : {total_co2:.1f} kg")
    print(f"  🛡️  Returns prevented: {prevented}")


if __name__ == "__main__":
    generate_synthetic_data()
    db.close()
