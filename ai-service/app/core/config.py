from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    env: str = "development"
    port: int = 8000

    ai_service_api_key: str = "replace-with-internal-service-key"
    cors_origin: str = "http://localhost:4000"

    model_version: str = "rule-engine-v1.0.0"
    image_fetch_timeout: int = 10

    @property
    def cors_origins(self) -> list[str]:
        return [o.strip() for o in self.cors_origin.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
