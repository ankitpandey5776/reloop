import os
import json
import base64
import boto3
from botocore.exceptions import BotoCoreError, ClientError
from dotenv import load_dotenv

# Load .env from the backend directory (where uvicorn is run from)
# Supports both: running from backend/ directly, or from repo root
_this_file = os.path.abspath(__file__)
_backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(_this_file)))  # …/backend/
_env_path = os.path.join(_backend_dir, ".env")
if not os.path.exists(_env_path):
    # Fallback: running from repo root, backend/ is one level down
    _env_path = os.path.join(os.getcwd(), ".env")
load_dotenv(dotenv_path=_env_path, override=True)

class BedrockClient:
    def __init__(self):
        # Read fresh from env every time an instance is created
        mock_str = os.getenv("MOCK_MODE", "true").lower()
        self.mock_mode = mock_str not in ("false", "0", "no")
        self.model_id = os.getenv("BEDROCK_MODEL_ID", "anthropic.claude-sonnet-4-20250514")

        if not self.mock_mode:
            try:
                self.client = boto3.client(
                    service_name="bedrock-runtime",
                    region_name=os.getenv("AWS_REGION", "us-east-1"),
                    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
                    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
                )
                print(f"[BedrockClient] Initialized in LIVE mode. Model: {self.model_id}")
            except Exception as e:
                print(f"[BedrockClient] Failed to initialize, falling back to mock: {e}")
                self.mock_mode = True
        else:
            print("[BedrockClient] Running in MOCK mode.")
                
    def _get_mock_multimodal_response(self, prompt: str = "") -> str:
        # The mock only sees the *prompt*, never the image, so it can't truly
        # detect fraud/blur. These demo responses are gated behind explicit
        # sentinels ("DEMO_BRICK" / "DEMO_BLURRY"). They must NOT match plain
        # "fraud"/"blurry"/"counterfeit" — those words are baked into the
        # standard grading prompt ("fraud investigator", "too blurry or dark"),
        # which made EVERY item grade F and get rejected at routing.
        if "demo_brick" in prompt.lower():
            return json.dumps({
                "is_authentic": False,
                "is_blurry": False,
                "fraud_reason": "The uploaded item appears to be a brick, which does not match the expected product.",
                "grade": "F",
                "confidence": 0.99,
                "defects": [],
                "condition_report": "Return rejected. The item in the photo does not match the original purchase."
            })

        if "demo_blurry" in prompt.lower():
            return json.dumps({
                "is_authentic": True,
                "is_blurry": True,
                "fraud_reason": "",
                "grade": "F",
                "confidence": 0.20,
                "defects": [],
                "condition_report": "The photo provided is completely blurry and unrecognizable. Please retake the photo."
            })

        return json.dumps({
            "is_authentic": True,
            "is_blurry": False,
            "fraud_reason": "",
            "grade": "B",
            "confidence": 0.85,
            "defects": [
                {
                    "type": "scratch",
                    "location": "surface",
                    "severity": "minor"
                }
            ],
            "condition_report": "The item shows minor scratches on the surface but is overall in good condition."
        })
        
    def _get_mock_text_response(self, prompt: str) -> str:
        if "copywriter" in prompt.lower() or "title" in prompt.lower():
            return json.dumps({
                "title": "Eco-Friendly Second Life Deal",
                "description": "Don't miss out on this fantastic pre-loved item, carefully inspected and ready for a new home. Help save the planet while scoring a huge discount!"
            })
        return "This decision makes sense because the item is in good condition and can be sold locally to avoid shipping costs and reduce environmental impact."

    def invoke_multimodal(self, images: list[bytes], prompt: str) -> str:
        if self.mock_mode:
            return self._get_mock_multimodal_response(prompt)
            
        try:
            content = []
            
            for image_bytes in images:
                base64_image = base64.b64encode(image_bytes).decode('utf-8')
                content.append({
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": "image/jpeg",
                        "data": base64_image
                    }
                })
                
            content.append({
                "type": "text",
                "text": prompt
            })
            
            body = json.dumps({
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 1000,
                "messages": [
                    {
                        "role": "user",
                        "content": content
                    }
                ]
            })

            response = self.client.invoke_model(
                body=body,
                modelId=self.model_id,
                accept='application/json',
                contentType='application/json'
            )
            
            response_body = json.loads(response.get('body').read())
            return response_body.get('content', [{}])[0].get('text', self._get_mock_multimodal_response(prompt))
            
        except (BotoCoreError, ClientError, Exception) as e:
            err_str = str(e)
            if "Operation not allowed" in err_str or "not been submitted" in err_str:
                print(f"[BedrockClient] Bedrock model access not yet approved — using mock response. "
                      f"Enable model access at: https://console.aws.amazon.com/bedrock/home#/modelaccess")
            else:
                print(f"[BedrockClient] Bedrock multimodal error: {e}")
            return self._get_mock_multimodal_response(prompt)

    def invoke_text(self, prompt: str) -> str:
        if self.mock_mode:
            return self._get_mock_text_response(prompt)
            
        try:
            body = json.dumps({
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 500,
                "messages": [
                    {
                        "role": "user",
                        "content": [{"type": "text", "text": prompt}]
                    }
                ]
            })

            response = self.client.invoke_model(
                body=body,
                modelId=self.model_id,
                accept='application/json',
                contentType='application/json'
            )
            
            response_body = json.loads(response.get('body').read())
            return response_body.get('content', [{}])[0].get('text', self._get_mock_text_response(prompt))
            
        except (BotoCoreError, ClientError, Exception) as e:
            err_str = str(e)
            if "Operation not allowed" in err_str or "not been submitted" in err_str:
                print(f"[BedrockClient] Bedrock model access not yet approved — using mock response. "
                      f"Enable model access at: https://console.aws.amazon.com/bedrock/home#/modelaccess")
            else:
                print(f"[BedrockClient] Bedrock text error: {e}")
            return self._get_mock_text_response(prompt)

bedrock_client = BedrockClient()
