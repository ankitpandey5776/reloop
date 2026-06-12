import uuid
from datetime import datetime, timezone
from app.utils.constants import STATE_TRANSITIONS, CO2_FACTOR_PER_KM

def generate_uuid() -> str:
    return str(uuid.uuid4())

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

def validate_state_transition(current: str, target: str) -> bool:
    if current not in STATE_TRANSITIONS:
        return False
    return target in STATE_TRANSITIONS[current]

def calculate_co2_saved(km_avoided: float) -> float:
    return km_avoided * CO2_FACTOR_PER_KM
