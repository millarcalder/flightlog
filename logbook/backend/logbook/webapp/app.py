from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from logbook.config import Settings


settings = None
app = FastAPI()


def init_app(env_file=None) -> FastAPI:
    global settings
    settings = Settings(_env_file=env_file)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "*"
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return app


@app.get("/health")
def health():
    return {}
