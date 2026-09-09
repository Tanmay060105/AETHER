from pydantic import PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "AETHER"
    DATABASE_URL: PostgresDsn
    REDIS_URL: str = "redis://localhost:6379/0"
    JWT_SECRET: str = "your_super_secret_jwt_key_here"
    BACKEND_CORS_ORIGINS: list[str] = ["*"]

    model_config = SettingsConfigDict(env_file="../.env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
