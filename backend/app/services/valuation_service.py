from app.services.bedrock_client import bedrock_client

class ValuationService:
    def __init__(self):
        self.grade_multipliers = {
            'A': 0.85,
            'B': 0.70,
            'C': 0.50,
            'D': 0.20
        }
        
        self.category_demand_factors = {
            'electronics': 1.1,
            'fashion': 0.9,
            'home': 1.0,
            'books': 0.8,
            'other': 0.7
        }

    def calculate_value(self, grade: str, original_price: int, category: str) -> dict:
        grade = grade.upper() if isinstance(grade, str) else 'B'

        # Grade F = fraud/invalid item — zero value, no marketing copy needed
        if grade == 'F':
            return {
                "resale_price": 0,
                "price_multiplier": 0.0,
                "demand_factor": 0.0,
            }

        if grade not in self.grade_multipliers:
            grade = 'B'
            grade = 'B'
            
        category = category.lower() if isinstance(category, str) else 'other'
        if category not in self.category_demand_factors:
            category = 'other'

        price_multiplier = self.grade_multipliers[grade]
        demand_factor = self.category_demand_factors[category]
        
        resale_price = int(original_price * price_multiplier * demand_factor)
        
        # --- Gen-AI Auto-Merchandising ---
        # Instead of static descriptions, generate dynamic SEO-optimized marketing copy!
        ai_prompt = f"""
        You are a top-tier copywriter for Amazon's Second Life marketplace. 
        Write a short, engaging product title and a 2-sentence description for a returned {category} item.
        The item's condition grade is {grade} (A=Like New, B=Good, C=Fair, D=Salvage).
        Return EXACTLY a JSON object with "title" and "description" keys. No markdown.
        """
        
        marketing_copy_json = bedrock_client.invoke_text(ai_prompt)
        marketing_title = "Second Life Item"
        marketing_desc = "A great find from our Second Life program."
        
        try:
            # Clean possible markdown
            clean_str = marketing_copy_json.strip()
            if clean_str.startswith("```json"): clean_str = clean_str[7:]
            if clean_str.startswith("```"): clean_str = clean_str[3:]
            if clean_str.endswith("```"): clean_str = clean_str[:-3]
            clean_str = clean_str.strip()
            
            import json
            marketing_data = json.loads(clean_str)
            marketing_title = marketing_data.get("title", marketing_title)
            marketing_desc = marketing_data.get("description", marketing_desc)
        except Exception as e:
            print(f"Failed to generate auto-merchandising: {e}")
        
        return {
            "resale_price": resale_price,
            "price_multiplier": price_multiplier,
            "demand_factor": demand_factor,
            "marketing_title": marketing_title,
            "marketing_description": marketing_desc
        }

valuation_service = ValuationService()
