import random
from datetime import datetime
from app.services.bedrock_client import bedrock_client

class RoutingService:
    def __init__(self):
        self.reasoning_prompt = """
You are Amazon's AI disposition engine. Explain why this routing decision is optimal.

Item: {title} (₹{original_price})
Grade: {grade} — {condition_report}
Decision: {decision}
Cost saved: ₹{cost_saved} | CO2 saved: {co2_saved_kg} kg | Distance avoided: {km_avoided} km

Write a 2-sentence explanation for the customer about why this is the best path for their item.
Keep it warm, specific, and mention the environmental benefit. Respond with plain text only.
"""
        
    def route_item(self, twin: dict) -> dict:
        item = twin.get('item', {})
        customer = twin.get('customer', {})
        grading = twin.get('grading', {})
        valuation = twin.get('valuation', {})
        
        grade = grading.get('grade', 'B')
        demand_factor = valuation.get('demand_factor', 1.0)
        resale_price = valuation.get('resale_price', 0)
        
        # Determine Decision
        decision = "RECYCLE"
        if grade == 'A':
            if demand_factor >= 1.0:
                decision = "RESELL_P2P"
            else:
                decision = "RESELL_RENEWED"
        elif grade == 'B':
            if resale_price > 500:
                decision = "RESELL_P2P"
            else:
                decision = "REFURBISH"
        elif grade == 'C':
            decision = "DONATE"
        elif grade == 'D':
            decision = "RECYCLE"
            
        # Calculate Costs & Distances
        baseline_cost = 350
        route_costs = {
            "RESELL_P2P": 80,
            "RESELL_RENEWED": 200,
            "REFURBISH": 200,
            "DONATE": 50,
            "RECYCLE": 30
        }
        
        route_cost = route_costs.get(decision, 350)
        cost_saved = baseline_cost - route_cost
        
        km_ranges = {
            "RESELL_P2P": (10, 100),
            "RESELL_RENEWED": (300, 800),
            "REFURBISH": (150, 500),
            "DONATE": (10, 50),
            "RECYCLE": (10, 30)
        }
        min_km, max_km = km_ranges.get(decision, (0, 0))
        km_avoided = random.randint(min_km, max_km)

        # CO2 saving = (baseline warehouse round-trip km) - (actual route km)
        # Standard road freight: ~0.21 kg CO2 per km per shipment
        BASELINE_KM = random.randint(400, 800)   # typical national return round-trip
        actual_km   = km_avoided
        net_km_saved = max(BASELINE_KM - actual_km, actual_km)  # km truly avoided
        co2_saved_kg = round(net_km_saved * 0.21, 2)  # realistic: ~0.21 kg/km
        
        customer_pincode = customer.get('pincode', '000000')
        nearby_pincode = str(int(customer_pincode) + random.randint(1, 10)) if customer_pincode.isdigit() else customer_pincode

        # Pincode → city name for realistic destination display
        PINCODE_CITY = {
            '700': 'Kolkata', '400': 'Mumbai', '560': 'Bangalore',
            '110': 'Delhi',   '600': 'Chennai','500': 'Hyderabad',
            '380': 'Ahmedabad','411': 'Pune',
        }
        def get_city(pin):
            return PINCODE_CITY.get(str(pin)[:3]) or PINCODE_CITY.get(str(pin)[:2] + '0') or 'your city'

        seller_city = get_city(customer_pincode)
        buyer_city  = get_city(nearby_pincode)

        # Realistic buyer names for P2P
        P2P_BUYER_NAMES = [
            'Rahul Sharma', 'Priya Patel', 'Arjun Singh', 'Neha Gupta',
            'Amit Kumar', 'Sunita Joshi', 'Vikram Nair', 'Ananya Reddy',
        ]
        p2p_buyer = random.choice(P2P_BUYER_NAMES)

        # Assign Destination
        destinations = {
            "RESELL_P2P":    {"type": "buyer",              "name": p2p_buyer,                  "pincode": nearby_pincode},
            "RESELL_RENEWED":{"type": "fulfillment_center", "name": "Amazon Renewed FC",         "pincode": "400001"},
            "REFURBISH":     {"type": "refurbisher",        "name": "Certified Repair Partner",  "pincode": "560001"},
            "DONATE":        {"type": "ngo",                "name": "GreenHands Foundation",     "pincode": customer_pincode},
            "RECYCLE":       {"type": "recycler",           "name": "EcoRecycle India",          "pincode": "411001"},
        }
        destination = destinations.get(decision, destinations["RECYCLE"])
        
        # Determine Credits
        credit_values = {
            "RESELL_P2P": 50,
            "RESELL_RENEWED": 30,
            "REFURBISH": 25,
            "DONATE": 40,
            "RECYCLE": 20
        }
        earned_credits = credit_values.get(decision, 0)
        
        # Generate Reasoning using Bedrock
        prompt = self.reasoning_prompt.format(
            title=item.get('title', 'Product'),
            original_price=item.get('original_price', 0),
            grade=grade,
            condition_report=grading.get('condition_report', 'N/A'),
            decision=decision,
            cost_saved=cost_saved,
            co2_saved_kg=co2_saved_kg,
            km_avoided=km_avoided
        )
        reasoning = bedrock_client.invoke_text(prompt)
        
        return {
            "routing": {
                "decision": decision,
                "reasoning": reasoning.strip(),
                "destination": destination,
                "savings": {
                    "cost_saved": cost_saved,
                    "co2_saved_kg": co2_saved_kg,
                    "km_avoided": km_avoided
                },
                "routed_at": datetime.utcnow().isoformat() + "Z"
            },
            "credits": {
                "earned": earned_credits,
                "action": decision.lower(),
                # Assuming lifetime credits will be managed or aggregated later, we'll initialize or add it here
                "lifetime_credits": twin.get('credits', {}).get('lifetime_credits', 0) + earned_credits
            }
        }

routing_service = RoutingService()
