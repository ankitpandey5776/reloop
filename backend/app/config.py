from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./reloop.db"
    UPLOAD_DIR: str = "./uploads"
    AWS_REGION: str = "us-east-1"
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    BEDROCK_MODEL_ID: str = ""
    MOCK_MODE: bool = True
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:5173"]
    # Groq integration
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "meta-llama/llama-4-scout-17b-16e-instruct"

    class Config:
        env_file = ".env"
        extra = "ignore"   # silently ignore any extra env vars

@lru_cache()
def get_settings():
    return Settings()
