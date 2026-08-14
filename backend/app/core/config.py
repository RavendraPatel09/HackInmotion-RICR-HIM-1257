import os
import json
from pathlib import Path

# Load .env file manually if it exists
env_path = Path(__file__).resolve().parent.parent.parent / ".env"
if env_path.exists():
    with open(env_path, "r") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            key, val = line.split("=", 1)
            os.environ[key.strip()] = val.strip()

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/nagarsathi")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "f604b77f985047b864d436bf64c207cd454b5dfd4f647970d4d12f1712a67e2a")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))
    
    # CORS Origins
    cors_raw = os.getenv("CORS_ORIGINS", '["http://localhost:5173"]')
    try:
        CORS_ORIGINS: list = json.loads(cors_raw)
    except Exception:
        CORS_ORIGINS: list = ["http://localhost:5173"]

settings = Settings()
