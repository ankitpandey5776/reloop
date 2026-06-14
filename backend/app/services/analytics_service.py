from app.database import Twin

class AnalyticsService:
    def get_dashboard_stats(self, db) -> dict:
        twins = db.query(Twin).all()

        total_twins = len(twins)
        returns_prevented = 0
        total_cost_saved = 0
        total_co2_saved_kg = 0.0
        items_by_state = {}
        items_by_route = {}
        items_by_grade = {}          # ← Feature: real grade distribution for dashboard chart

        for twin in twins:
            # Count states
            state = twin.state
            items_by_state[state] = items_by_state.get(state, 0) + 1

            # Count prevention
            if twin.prevention_data and twin.prevention_data.get("prevented"):
                returns_prevented += 1

            # Count grades (only graded items have grading_data)
            if twin.grading_data:
                grade = twin.grading_data.get("grade")
                if grade and grade in ("A", "B", "C", "D"):   # exclude F (fraud/invalid)
                    items_by_grade[grade] = items_by_grade.get(grade, 0) + 1

            # Count savings and routes
            if twin.routing_data:
                decision = twin.routing_data.get("decision")
                if decision:
                    items_by_route[decision] = items_by_route.get(decision, 0) + 1

                savings = twin.routing_data.get("savings", {})
                total_cost_saved += savings.get("cost_saved", 0)
                total_co2_saved_kg += savings.get("co2_saved_kg", 0.0)

        return {
            "total_twins": total_twins,
            "returns_prevented": returns_prevented,
            "total_cost_saved": total_cost_saved,
            "total_co2_saved_kg": round(total_co2_saved_kg, 2),
            "items_by_state": items_by_state,
            "items_by_route": items_by_route,
            "items_by_grade": items_by_grade,   # ← new field, backwards-compatible
        }

    def get_recent_twins(self, limit: int, db) -> list:
        twins = db.query(Twin).order_by(Twin.updated_at.desc()).limit(limit).all()
        
        results = []
        for twin in twins:
            results.append({
                "twin_id": twin.twin_id,
                "state": twin.state,
                "item": twin.item_data,
                "updated_at": twin.updated_at.isoformat()
            })
            
        return results
