from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_uri: str

    s3_endpoint_url: str | None = None
    aws_access_key_id: str | None = None
    aws_secret_access_key: str | None = None

    igc_files_bucket: str = "logbook-igc-files"

    # to get a string like this run: openssl rand -hex 32
    password_hash_secret_key: str
    password_hash_algorithm: str
    access_token_expire_minutes: int
