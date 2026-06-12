from app.database import Twin
from app.utils.constants import CREDIT_VALUES

class CreditsService:
    def award_credits(self, twin_id: str, action: str, db) -> dict:
        twin = db.query(Twin).filter(Twin.twin_id == twin_id).first()
        if not twin:
            return None
            
        earned = CREDIT_VALUES.get(action, 0)
        
        current_credits = twin.credits_data or {}
        lifetime = current_credits.get("lifetime_credits", 0) + earned
        
        credits_data = {
            "earned": earned,
            "action": action,
            "lifetime_credits": lifetime
        }
        
        twin.credits_data = credits_data
        db.commit()
        return credits_data
        
    def get_customer_credits(self, customer_id: str, db) -> dict:
        twins = db.query(Twin).all()
        
        total_credits = 0
        history = []
        
        for twin in twins:
            customer = twin.customer_data or {}
            if customer.get("customer_id") == customer_id:
                if twin.credits_data:
                    credits = twin.credits_data
                    total_credits += credits.get("earned", 0)
                    history.append({
                        "twin_id": twin.twin_id,
                        "action": credits.get("action"),
                        "earned": credits.get("earned"),
                        "date": twin.updated_at.isoformat()
                    })
                    
        return {
            "customer_id": customer_id,
            "total_credits": total_credits,
            "history": history
        }
