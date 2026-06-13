import json
from datetime import datetime
from app.services.bedrock_client import bedrock_client

class GradingService:
    def __init__(self):
        self.prompt_template = """
You are an expert product quality grader for Amazon's Second Life Commerce program.

Analyze the provided product photos and assess the item's physical condition.

Product Info:
- Title: {title}
- Category: {category}
- Original Price: ₹{original_price}

Respond ONLY with a JSON object (no markdown, no backticks, no extra text):
{{
  "grade": "A or B or C or D",
  "confidence": <float between 0.0 and 1.0>,
  "defects": [
    {{
      "type": "<one of: scratch, dent, stain, missing_part, discoloration, packaging_damage>",
      "location": "<where on the item>",
      "severity": "<one of: minor, moderate, major>"
    }}
  ],
  "condition_report": "<2-3 sentence human-readable summary of condition>"
}}

Grading scale:
A (Like New): No visible defects, original packaging intact, could pass as new
B (Good): Minor cosmetic defects only, fully functional, light wear
C (Fair): Noticeable wear or cosmetic damage, functional but visible defects
D (Salvage): Significant damage, missing parts, or non-functional components

Be precise about defect locations. Be honest about condition.
"""

    def _get_fallback_grading(self) -> dict:
        return {
            "grade": "B",
            "confidence": 0.5,
            "defects": [],
            "photo_urls": [],
            "condition_report": "Unable to fully assess condition automatically. Defaulting to Good condition.",
            "graded_at": datetime.utcnow().isoformat() + "Z"
        }

    def grade_item(self, photos: list[bytes], item_info: dict) -> dict:
        try:
            prompt = self.prompt_template.format(
                title=item_info.get('title', 'Unknown Product'),
                category=item_info.get('category', 'other'),
                original_price=item_info.get('original_price', 0)
            )

            response_text = bedrock_client.invoke_multimodal(photos, prompt)
            
            # Clean up the response if the LLM included markdown by accident
            clean_json_str = response_text.strip()
            if clean_json_str.startswith("```json"):
                clean_json_str = clean_json_str[7:]
            if clean_json_str.startswith("```"):
                clean_json_str = clean_json_str[3:]
            if clean_json_str.endswith("```"):
                clean_json_str = clean_json_str[:-3]
            clean_json_str = clean_json_str.strip()

            grading_result = json.loads(clean_json_str)

            # Validation
            if grading_result.get('grade') not in ['A', 'B', 'C', 'D']:
                grading_result['grade'] = 'B'
                
            confidence = grading_result.get('confidence', 0.5)
            if not isinstance(confidence, (int, float)) or not (0 <= confidence <= 1):
                grading_result['confidence'] = 0.5
                
            if not isinstance(grading_result.get('defects'), list):
                grading_result['defects'] = []
                
            if not grading_result.get('condition_report'):
                grading_result['condition_report'] = "Assessed automatically."
                
            grading_result['photo_urls'] = [] # To be filled by the router
            grading_result['graded_at'] = datetime.utcnow().isoformat() + "Z"
            
            return grading_result
            
        except Exception as e:
            print(f"Error parsing grading response: {e}")
            return self._get_fallback_grading()

grading_service = GradingService()
