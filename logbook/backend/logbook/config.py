from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_uri: str
