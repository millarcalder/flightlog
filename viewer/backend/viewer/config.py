from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    s3_endpoint_url: str | None = None
    aws_access_key_id: str | None = None
    aws_secret_access_key: str | None = None
