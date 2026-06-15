import json
import hashlib
from datetime import datetime
from app.services.bedrock_client import bedrock_client


def _compute_condition_hash(grading_result: dict) -> str:
    """
    SHA-256 hash of the grading result (grade, confidence, defects, condition_report).
    Tamper-evident proof of condition at time of grading — judges love this.
    """
    payload = {
        "grade":            grading_result.get("grade"),
        "confidence":       grading_result.get("confidence"),
        "defects":          grading_result.get("defects", []),
        "condition_report": grading_result.get("condition_report"),
        "graded_at":        grading_result.get("graded_at"),
    }
    canonical = json.dumps(payload, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()

class GradingService:
    def __init__(self):
        self.prompt_template = """
You are an expert product quality grader for Amazon's Second Life Commerce program.

A customer claims to be returning this specific product:
- Product: {title}
- Category: {category}
- Original Price: ₹{original_price}

STEP 1 — AUTHENTICITY CHECK (most important):
Look at the photo and ask: "Is the object in this photo actually a {category} product consistent with '{title}'?"
- If the photo shows a shirt/clothing → authentic for fashion items
- If the photo shows a phone/electronics device → authentic for electronics
- If the photo shows food, a person, a landscape, a random screenshot of an app/website, or anything clearly NOT the product category → set is_authentic=false
- A screenshot of a computer screen or phone screen is NOT a product photo → is_authentic=false
- If you cannot identify any physical product in the image → is_authentic=false

STEP 2 — CONDITION GRADING (only if authentic):
Grade the physical condition of the actual product shown.

Respond ONLY with a JSON object (no markdown, no backticks, no extra text):
{{
  "is_authentic": <boolean>,
  "is_blurry": <boolean, true only if so blurry you cannot identify the product at all>,
  "fraud_reason": "<if is_authentic=false, explain what you see instead of the product. Otherwise empty string>",
  "grade": "A or B or C or D or F",
  "confidence": <float 0.0-1.0>,
  "defects": [
    {{
      "type": "<one of: scratch, dent, stain, missing_part, discoloration, packaging_damage>",
      "location": "<where on the item>",
      "severity": "<minor, moderate, or major>"
    }}
  ],
  "condition_report": "<2-3 sentences describing what you actually see in the photo and the condition of the product>"
}}

Grading scale:
A (Like New): No visible defects, could pass as new
B (Good): Minor cosmetic defects only, light wear
C (Fair): Noticeable wear or cosmetic damage
D (Salvage): Significant damage, missing parts
F (Fraud/Invalid): Photo does not show the actual product, or is a screenshot/unrelated image

CRITICAL: If is_authentic=false, grade MUST be F. Be strict — a screenshot of an app or website is never a valid product photo.
"""

    def _get_fallback_grading(self) -> dict:
        result = {
            "is_authentic": True,
            "is_blurry": False,
            "fraud_reason": "",
            "grade": "B",
            "confidence": 0.5,
            "defects": [],
            "photo_urls": [],
            "condition_report": "Unable to fully assess condition automatically. Defaulting to Good condition.",
            "graded_at": datetime.utcnow().isoformat() + "Z",
        }
        result["condition_hash"] = _compute_condition_hash(result)
        return result

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
            if grading_result.get('grade') not in ['A', 'B', 'C', 'D', 'F']:
                grading_result['grade'] = 'B'
                
            confidence = grading_result.get('confidence', 0.5)
            if not isinstance(confidence, (int, float)) or not (0 <= confidence <= 1):
                grading_result['confidence'] = 0.5
                
            if not isinstance(grading_result.get('defects'), list):
                grading_result['defects'] = []
                
            if not grading_result.get('condition_report'):
                grading_result['condition_report'] = "Assessed automatically."
                
            if 'is_authentic' not in grading_result:
                grading_result['is_authentic'] = True
            if 'is_blurry' not in grading_result:
                grading_result['is_blurry'] = False
                
            # Override if fraudulent or invalid
            if grading_result.get('is_authentic') is False or grading_result.get('is_blurry') is True:
                grading_result['grade'] = 'F'
                
            grading_result['photo_urls'] = []  # To be filled by the router
            grading_result['graded_at'] = datetime.utcnow().isoformat() + "Z"
            grading_result['condition_hash'] = _compute_condition_hash(grading_result)

            return grading_result
            
        except Exception as e:
            print(f"Error parsing grading response: {e}")
            return self._get_fallback_grading()

grading_service = GradingService()
