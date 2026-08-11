import os
from typing import List, Union
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Mirror - Virtual Fitting Room"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key-ai-mirror-2026-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # CORS Configuration
    BACKEND_ALLOWED_ORIGINS: str = os.getenv(
        "BACKEND_ALLOWED_ORIGINS", 
        "http://localhost:3000,http://127.0.0.1:3000"
    )

    # Database Configuration (SQLite default for local dev, PostgreSQL for production)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./ai_mirror.db")
    
    # AI Virtual Try-On API Integration
    VIRTUAL_TRYON_API_KEY: str = os.getenv("VIRTUAL_TRYON_API_KEY", "")
    VIRTUAL_TRYON_PROVIDER: str = os.getenv("VIRTUAL_TRYON_PROVIDER", "mock") # mock | fal_ai | viton_hd
    AI_PROVIDER_API_KEY: str = os.getenv("AI_PROVIDER_API_KEY", "")
    
    # Retailer Credentials (Optional environment configs)
    MYNTRA_API_KEY: str = os.getenv("MYNTRA_API_KEY", "")
    MYNTRA_API_SECRET: str = os.getenv("MYNTRA_API_SECRET", "")
    NYKAA_API_KEY: str = os.getenv("NYKAA_API_KEY", "")
    NYKAA_API_SECRET: str = os.getenv("NYKAA_API_SECRET", "")
    AJIO_API_KEY: str = os.getenv("AJIO_API_KEY", "")
    AMAZON_API_KEY: str = os.getenv("AMAZON_API_KEY", "")

    # Storage
    STORAGE_BUCKET: str = os.getenv("STORAGE_BUCKET", "local_storage")

    class Config:
        case_sensitive = True

settings = Settings()
