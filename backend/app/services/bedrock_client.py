"""
AI client for ReLoop grading and routing.

Primary:  Groq — meta-llama/llama-4-scout-17b-16e-instruct (vision, ~460 tok/s, free tier)
Fallback: Image-analysis mock (PIL brightness/size → realistic grade)
"""
import os
import json
import base64
import random
from dotenv import load_dotenv

_this_file   = os.path.abspath(__file__)
_backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(_this_file)))
_env_path    = os.path.join(_backend_dir, ".env")
if not os.path.exists(_env_path):
    _env_path = os.path.join(os.getcwd(), ".env")
load_dotenv(dotenv_path=_env_path, override=True)


# ── Image-based fallback (no API needed) ──────────────────────────────────────
def _image_based_grade(image_bytes: bytes) -> dict:
    try:
        from PIL import Image, ImageStat
        import io
        img  = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img.thumbnail((300, 300))
        stat = ImageStat.Stat(img)
        brightness = sum(stat.mean) / 3
        variance   = sum(stat.stddev) / 3
        size_kb    = len(image_bytes) / 1024
        score = (brightness / 255 * 40) + (variance / 80 * 35) + min(size_kb / 200 * 25, 25)

        if score >= 75:
            grade, conf = "A", round(random.uniform(0.88, 0.97), 2)
            defects = []
            report  = "Item appears to be in excellent, like-new condition. No visible defects detected."
        elif score >= 55:
            grade, conf = "B", round(random.uniform(0.82, 0.92), 2)
            defects = [{"type": "scratch", "location": "surface area", "severity": "minor"}]
            report  = "Item shows minor signs of use but remains in good working condition. Suitable for resale."
        elif score >= 35:
            grade, conf = "C", round(random.uniform(0.74, 0.85), 2)
            defects = [
                {"type": "scratch",       "location": "front panel", "severity": "moderate"},
                {"type": "discoloration", "location": "edges",       "severity": "minor"},
            ]
            report  = "Item shows noticeable wear and moderate cosmetic damage. Functionally operational."
        else:
            grade, conf = "D", round(random.uniform(0.65, 0.78), 2)
            defects = [
                {"type": "dent",              "location": "main body",    "severity": "major"},
                {"type": "packaging_damage",  "location": "outer casing", "severity": "moderate"},
            ]
            report  = "Item has significant visible damage. Recommended for recycling or parts recovery."
    except Exception:
        size_kb = len(image_bytes) / 1024
        grade   = "B" if size_kb > 100 else "C"
        conf    = 0.82
        defects = [{"type": "scratch", "location": "surface", "severity": "minor"}]
        report  = f"Item assessed in {'good' if grade == 'B' else 'fair'} condition with minor cosmetic wear."

    return {
        "is_authentic": True, "is_blurry": False, "fraud_reason": "",
        "grade": grade, "confidence": conf,
        "defects": defects, "condition_report": report,
    }


def _smart_text_response(prompt: str) -> str:
    decisions = {
        "RESELL_P2P":    "Your item is in great shape and there's strong local demand — a direct peer-to-peer sale eliminates warehouse trips and gets you paid faster.",
        "RESELL_RENEWED":"Sending to Amazon Renewed ensures professional certification and reaches a wider national audience, maximising recovery value.",
        "REFURBISH":     "A certified repair partner nearby can restore this item to near-new condition, giving it a full second life.",
        "DONATE":        "This item will go directly to a local NGO partner — zero shipping cost and maximum green credits.",
        "RECYCLE":       "Responsible recycling recovers raw materials and prevents harmful e-waste from reaching landfill.",
    }
    for decision, reasoning in decisions.items():
        if decision in prompt.upper():
            return reasoning
    if "copywriter" in prompt.lower() or "title" in prompt.lower():
        return json.dumps({
            "title": "AI-Verified Second Life Item",
            "description": "Pre-owned and certified by ReLoop's AI grading system. Condition verified and tamper-proof."
        })
    return decisions["RESELL_P2P"]


# ── Main client ───────────────────────────────────────────────────────────────
class BedrockClient:
    def __init__(self):
        mock_str       = os.getenv("MOCK_MODE", "true").lower()
        self.mock_mode = mock_str not in ("false", "0", "no")
        self.groq_key  = os.getenv("GROQ_API_KEY", "")
        self.groq_model = os.getenv("GROQ_MODEL", "meta-llama/llama-4-scout-17b-16e-instruct")
        self._groq_ok  = False
        self._groq_client = None

        if self.mock_mode:
            print("[AIClient] MOCK mode — using image-analysis grading.")
            return

        if self.groq_key:
            try:
                from groq import Groq
                self._groq_client = Groq(api_key=self.groq_key)
                self._groq_ok     = True
                print(f"[AIClient] Groq initialised — model: {self.groq_model}")
            except Exception as e:
                print(f"[AIClient] Groq init error: {e} — using image-analysis fallback.")
        else:
            print("[AIClient] No GROQ_API_KEY — using image-analysis grading.")

    def invoke_multimodal(self, images: list[bytes], prompt: str) -> str:
        if not self.mock_mode and self._groq_ok and self._groq_client:
            try:
                # Build content parts: one base64 image + the text prompt
                image_parts = []
                for img_bytes in images[:4]:          # max 4 images
                    b64 = base64.b64encode(img_bytes).decode("utf-8")
                    # Detect mime type from magic bytes
                    if img_bytes[:3] == b"\xff\xd8\xff":
                        mime = "image/jpeg"
                    elif img_bytes[:8] == b"\x89PNG\r\n\x1a\n":
                        mime = "image/png"
                    else:
                        mime = "image/jpeg"
                    image_parts.append({
                        "type":      "image_url",
                        "image_url": {"url": f"data:{mime};base64,{b64}"},
                    })

                content = image_parts + [{"type": "text", "text": prompt}]

                response = self._groq_client.chat.completions.create(
                    model=self.groq_model,
                    messages=[{"role": "user", "content": content}],
                    temperature=0.1,
                    max_tokens=1024,
                )
                return response.choices[0].message.content

            except Exception as e:
                err = str(e)
                if "429" in err or "rate" in err.lower() or "quota" in err.lower():
                    print(f"[AIClient] Groq rate limit — falling back to image analysis.")
                else:
                    print(f"[AIClient] Groq error: {e} — falling back to image analysis.")

        # Fallback — PIL image analysis
        if images:
            return json.dumps(_image_based_grade(images[0]))
        return json.dumps({
            "is_authentic": True, "is_blurry": False, "fraud_reason": "",
            "grade": "B", "confidence": 0.85,
            "defects": [], "condition_report": "Item assessed in good condition.",
        })

    def invoke_text(self, prompt: str) -> str:
        if not self.mock_mode and self._groq_ok and self._groq_client:
            try:
                response = self._groq_client.chat.completions.create(
                    model="llama-3.3-70b-versatile",   # fast text model for routing
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.2,
                    max_tokens=512,
                )
                return response.choices[0].message.content
            except Exception as e:
                print(f"[AIClient] Groq text error: {e}")
        return _smart_text_response(prompt)


bedrock_client = BedrockClient()
