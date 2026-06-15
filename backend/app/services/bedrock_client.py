"""
AI client for ReLoop grading and routing.

Primary: Google Gemini 2.5 Flash (multimodal image+text, free tier)
Fallback: AWS Bedrock (if credentials work)
Mock: Realistic hardcoded responses for demo/testing
"""
import os
import json
import base64
from dotenv import load_dotenv

# Load .env from the backend directory
_this_file = os.path.abspath(__file__)
_backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(_this_file)))
_env_path = os.path.join(_backend_dir, ".env")
if not os.path.exists(_env_path):
    _env_path = os.path.join(os.getcwd(), ".env")
load_dotenv(dotenv_path=_env_path, override=True)


class BedrockClient:
    """
    AI client with three modes:
    1. Gemini (USE_GEMINI=true) — primary, free, multimodal
    2. Bedrock (MOCK_MODE=false, USE_GEMINI=false) — AWS Claude
    3. Mock (MOCK_MODE=true) — realistic hardcoded responses
    """

    def __init__(self):
        mock_str    = os.getenv("MOCK_MODE", "true").lower()
        self.mock_mode   = mock_str not in ("false", "0", "no")
        self.use_gemini  = os.getenv("USE_GEMINI", "false").lower() in ("true", "1", "yes")
        self.gemini_key  = os.getenv("GEMINI_API_KEY", "")
        self.gemini_model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        self.model_id    = os.getenv("BEDROCK_MODEL_ID", "us.anthropic.claude-sonnet-4-5-20250929-v1:0")

        if self.mock_mode:
            print("[AIClient] Running in MOCK mode.")
            return

        if self.use_gemini and self.gemini_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.gemini_key)
                self.genai        = genai
                self.gemini_model = genai.GenerativeModel(self.gemini_model_name)
                # Quick ping to verify
                test = self.gemini_model.generate_content("Reply: OK")
                print(f"[AIClient] Gemini {self.gemini_model_name} ready.")
            except Exception as e:
                print(f"[AIClient] Gemini init failed, falling back to mock: {e}")
                self.mock_mode = True
        else:
            # Try Bedrock
            try:
                import boto3
                self.bedrock = boto3.client(
                    service_name="bedrock-runtime",
                    region_name=os.getenv("AWS_REGION", "us-east-1"),
                    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
                    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
                )
                print(f"[AIClient] Bedrock initialized. Model: {self.model_id}")
            except Exception as e:
                print(f"[AIClient] Bedrock init failed, falling back to mock: {e}")
                self.mock_mode = True

    # ── Mock responses ──────────────────────────────────────────────

    def _mock_multimodal(self, prompt: str = "") -> str:
        p = prompt.lower()
        if "brick" in p or "counterfeit" in p:
            return json.dumps({
                "is_authentic": False, "is_blurry": False,
                "fraud_reason": "Item does not match expected product.",
                "grade": "F", "confidence": 0.99, "defects": [],
                "condition_report": "Return rejected. Item does not match original purchase."
            })
        if "blurry" in p:
            return json.dumps({
                "is_authentic": True, "is_blurry": True, "fraud_reason": "",
                "grade": "F", "confidence": 0.20, "defects": [],
                "condition_report": "Photo is too blurry. Please retake."
            })
        return json.dumps({
            "is_authentic": True, "is_blurry": False, "fraud_reason": "",
            "grade": "B", "confidence": 0.87,
            "defects": [{"type": "scratch", "location": "surface", "severity": "minor"}],
            "condition_report": "Item shows minor surface scratches but is fully functional and in good condition."
        })

    def _mock_text(self, prompt: str) -> str:
        if "copywriter" in prompt.lower() or "title" in prompt.lower():
            return json.dumps({
                "title": "Pre-Loved Item — Grade B",
                "description": "A well-maintained second-life product, AI-graded and certified. Great value."
            })
        return ("Your item is in great condition and there's local demand nearby — "
                "a direct peer-to-peer sale keeps it in circulation and saves CO₂ vs. a warehouse trip.")

    # ── Gemini calls ────────────────────────────────────────────────

    def _gemini_multimodal(self, images: list, prompt: str) -> str:
        from PIL import Image
        import io

        parts = []
        for img_bytes in images:
            img = Image.open(io.BytesIO(img_bytes))
            parts.append(img)
        parts.append(prompt)

        try:
            response = self.gemini_model.generate_content(parts)
            return response.text
        except Exception as e:
            print(f"[AIClient] Gemini vision error: {e}")
            return self._mock_multimodal(prompt)

    def _gemini_text(self, prompt: str) -> str:
        try:
            response = self.gemini_model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"[AIClient] Gemini text error: {e}")
            return self._mock_text(prompt)

    # ── Bedrock calls ───────────────────────────────────────────────

    def _bedrock_multimodal(self, images: list, prompt: str) -> str:
        import boto3
        from botocore.exceptions import BotoCoreError, ClientError
        try:
            content = []
            for img_bytes in images:
                content.append({
                    "type": "image",
                    "source": {"type": "base64", "media_type": "image/jpeg",
                               "data": base64.b64encode(img_bytes).decode("utf-8")}
                })
            content.append({"type": "text", "text": prompt})

            body = json.dumps({
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 1000,
                "messages": [{"role": "user", "content": content}]
            })
            resp = self.bedrock.invoke_model(body=body, modelId=self.model_id,
                accept="application/json", contentType="application/json")
            result = json.loads(resp["body"].read())
            return result.get("content", [{}])[0].get("text", self._mock_multimodal(prompt))
        except Exception as e:
            print(f"[AIClient] Bedrock multimodal error: {e}")
            return self._mock_multimodal(prompt)

    def _bedrock_text(self, prompt: str) -> str:
        try:
            body = json.dumps({
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 500,
                "messages": [{"role": "user", "content": [{"type": "text", "text": prompt}]}]
            })
            resp = self.bedrock.invoke_model(body=body, modelId=self.model_id,
                accept="application/json", contentType="application/json")
            result = json.loads(resp["body"].read())
            return result.get("content", [{}])[0].get("text", self._mock_text(prompt))
        except Exception as e:
            print(f"[AIClient] Bedrock text error: {e}")
            return self._mock_text(prompt)

    # ── Public API ──────────────────────────────────────────────────

    def invoke_multimodal(self, images: list, prompt: str) -> str:
        if self.mock_mode:
            return self._mock_multimodal(prompt)
        if self.use_gemini and hasattr(self, "gemini_model"):
            return self._gemini_multimodal(images, prompt)
        return self._bedrock_multimodal(images, prompt)

    def invoke_text(self, prompt: str) -> str:
        if self.mock_mode:
            return self._mock_text(prompt)
        if self.use_gemini and hasattr(self, "gemini_model"):
            return self._gemini_text(prompt)
        return self._bedrock_text(prompt)


bedrock_client = BedrockClient()
