from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./reloop.db"
    UPLOAD_DIR: str = "./uploads"
    MOCK_MODE: bool = True
    CORS_ORIGINS: List[str] = ["*"]   # default: allow all (safe since no credentials)
    # Groq integration
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "meta-llama/llama-4-scout-17b-16e-instruct"

    class Config:
        env_file = ".env"
        extra = "ignore"

@lru_cache()
def get_settings():
    return Settings()
