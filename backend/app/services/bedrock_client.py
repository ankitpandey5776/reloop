import os
import json
import base64
import boto3
from botocore.exceptions import BotoCoreError, ClientError

MOCK_MODE = os.getenv("MOCK_MODE", "true").lower() == "true"

class BedrockClient:
    def __init__(self):
        self.mock_mode = MOCK_MODE
        self.model_id = os.getenv("BEDROCK_MODEL_ID", "anthropic.claude-3-sonnet-20240229-v1:0")
        
        if not self.mock_mode:
            try:
                self.client = boto3.client(
                    service_name='bedrock-runtime',
                    region_name=os.getenv("AWS_REGION", "us-east-1")
                )
            except Exception as e:
                print(f"Failed to initialize Bedrock client: {e}")
                self.mock_mode = True
                
    def _get_mock_multimodal_response(self) -> str:
        return json.dumps({
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
        return "This decision makes sense because the item is in good condition and can be sold locally to avoid shipping costs and reduce environmental impact."

    def invoke_multimodal(self, images: list[bytes], prompt: str) -> str:
        if self.mock_mode:
            return self._get_mock_multimodal_response()
            
        try:
            content = []
            
            for image_bytes in images:
                base64_image = base64.b64encode(image_bytes).decode('utf-8')
                content.append({
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": "image/jpeg", # assuming jpeg, could be passed or detected
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
            return response_body.get('content', [{}])[0].get('text', self._get_mock_multimodal_response())
            
        except (BotoCoreError, ClientError, Exception) as e:
            print(f"Bedrock multimodal invocation error: {e}")
            return self._get_mock_multimodal_response()

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
            print(f"Bedrock text invocation error: {e}")
            return self._get_mock_text_response(prompt)

bedrock_client = BedrockClient()
