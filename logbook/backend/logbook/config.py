from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_uri: str

    # to get a string like this run: openssl rand -hex 32
    password_hash_secret_key: str
    password_hash_algorithm: str
    access_token_expire_minutes: int
