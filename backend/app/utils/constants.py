VALID_STATES = ["ACTIVE", "RETURN_INTENT", "GRADED", "ROUTED", "LISTED", "SOLD", "DONATED", "RECYCLED"]
VALID_GRADES = ["A", "B", "C", "D"]
VALID_CATEGORIES = ["electronics", "fashion", "home", "books", "other"]
VALID_DECISIONS = ["RESELL_P2P", "RESELL_RENEWED", "REFURBISH", "DONATE", "RECYCLE"]
VALID_DEFECT_TYPES = ["scratch", "dent", "stain", "missing_part", "discoloration", "packaging_damage"]
VALID_SEVERITIES = ["minor", "moderate", "major"]

STATE_TRANSITIONS = {
    "ACTIVE": ["RETURN_INTENT"],
    "RETURN_INTENT": ["GRADED"],
    "GRADED": ["ROUTED"],
    "ROUTED": ["LISTED", "DONATED", "RECYCLED"],
    "LISTED": ["SOLD"],
    "SOLD": [],
    "DONATED": [],
    "RECYCLED": [],
}

GRADE_MULTIPLIERS = {"A": 0.85, "B": 0.70, "C": 0.50, "D": 0.20}
CATEGORY_DEMAND = {"electronics": 1.1, "fashion": 0.9, "home": 1.0, "books": 0.8, "other": 0.7}

CREDIT_VALUES = {
    "RESELL_P2P": 50,
    "RESELL_RENEWED": 30,
    "REFURBISH": 25,
    "DONATE": 40,
    "RECYCLE": 20,
    "RETURN_PREVENTED": 20,
}

BASELINE_RETURN_COST = 350  # INR
ROUTE_COSTS = {"RESELL_P2P": 80, "RESELL_RENEWED": 200, "REFURBISH": 150, "DONATE": 50, "RECYCLE": 30}
CO2_FACTOR_PER_KM = 0.0002  # kg CO2 per km
