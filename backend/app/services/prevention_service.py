class PreventionService:
    def check_risk(self, items: list, customer_id: str) -> dict:
        risk_score = 0.0
        risk_factors = []
        
        # Check for bracketing
        skus = [item.get("sku") for item in items]
        if len(skus) != len(set(skus)):
            risk_score += 0.3
            risk_factors.append("size_bracketing")
            
        categories = {}
        for item in items:
            cat = item.get("category", "other")
            categories[cat] = categories.get(cat, 0) + 1
            
            # Price sensitivity
            if item.get("original_price", 0) < 500:
                risk_score += 0.1
                if "impulse_buy_risk" not in risk_factors:
                    risk_factors.append("impulse_buy_risk")
                    
        # High return categories
        if "fashion" in categories:
            risk_score += 0.25
            risk_factors.append("high_return_category")
        elif "electronics" in categories:
            risk_score += 0.15
            risk_factors.append("medium_return_category")
        elif "home" in categories:
            risk_score += 0.10
            
        # Multiple items in same category
        for cat, count in categories.items():
            if count > 1:
                risk_score += 0.1 * (count - 1)
                
        risk_score = min(risk_score, 1.0)
        
        nudge_type = "none"
        nudge_message = ""
        
        if "size_bracketing" in risk_factors:
            nudge_type = "size_suggestion"
            nudge_message = "87% of buyers your size found this runs small. Consider ordering one size up instead of multiple sizes."
        elif "high_return_category" in risk_factors:
            nudge_type = "fit_predictor"
            nudge_message = "Try our virtual try-on to find your perfect fit and avoid returns."
        elif "impulse_buy_risk" in risk_factors:
            nudge_type = "keep_discount"
            nudge_message = "Get ₹50 off if you commit to keeping this item."
            
        return {
            "risk_score": round(risk_score, 2),
            "risk_factors": risk_factors,
            "nudge_type": nudge_type,
            "nudge_message": nudge_message
        }
