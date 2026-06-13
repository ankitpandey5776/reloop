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
        if grade not in self.grade_multipliers:
            grade = 'B'
            
        category = category.lower() if isinstance(category, str) else 'other'
        if category not in self.category_demand_factors:
            category = 'other'

        price_multiplier = self.grade_multipliers[grade]
        demand_factor = self.category_demand_factors[category]
        
        resale_price = int(original_price * price_multiplier * demand_factor)
        
        return {
            "resale_price": resale_price,
            "price_multiplier": price_multiplier,
            "demand_factor": demand_factor
        }

valuation_service = ValuationService()
