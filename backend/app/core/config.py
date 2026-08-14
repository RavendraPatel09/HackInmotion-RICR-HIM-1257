import os
import json
import socket
from pathlib import Path

# Load .env file manually if it exists
env_path = Path(__file__).resolve().parent.parent.parent / ".env"
if env_path.exists():
    with open(env_path, "r") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" not in line:
                continue
            key, val = line.split("=", 1)
            os.environ[key.strip()] = val.strip()

def is_postgres_reachable(url: str) -> bool:
    if "localhost" not in url and "127.0.0.1" not in url:
        return True
    try:
        s = socket.create_connection(("127.0.0.1", 5432), timeout=0.5)
        s.close()
        return True
    except Exception:
        return False

default_db_url = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/nagarsathi")
if default_db_url.startswith("postgresql") and not is_postgres_reachable(default_db_url):
    backend_dir = Path(__file__).resolve().parent.parent.parent
    db_path = str(backend_dir / "nagarsathi.db").replace("\\", "/")
    default_db_url = f"sqlite:///{db_path}"

class Settings:
    DATABASE_URL: str = default_db_url
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "f604b77f985047b864d436bf64c207cd454b5dfd4f647970d4d12f1712a67e2a")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))
    
    # SMTP Settings for OTP emails
    SMTP_HOST: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USERNAME: str = os.getenv("SMTP_USERNAME", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    SMTP_FROM_EMAIL: str = os.getenv("SMTP_FROM_EMAIL", os.getenv("SMTP_FROM", "noreply@nagarsathi.gov.in"))
    SMTP_FROM_NAME: str = os.getenv("SMTP_FROM_NAME", "NagarSathi")

    # Legacy alias for backward compatibility
    @property
    def SMTP_FROM(self):
        return self.SMTP_FROM_EMAIL

    # CORS Origins
    cors_raw = os.getenv("CORS_ORIGINS", '["http://localhost:5173"]')
    try:
        CORS_ORIGINS: list = json.loads(cors_raw)
    except Exception:
        CORS_ORIGINS: list = ["http://localhost:5173"]

settings = Settings()
