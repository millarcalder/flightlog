import logbook.webapp.app_globals as app_globals

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
from sqlalchemy import create_engine

from logbook.config import Settings
from logbook.lib.graphql_schema import schema


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    app_globals.db_engine.dispose()


app = FastAPI(lifespan=lifespan)
app.include_router(GraphQLRouter(schema), prefix='/graphql')


def init_app(env_file=None) -> FastAPI:
    app_globals.settings = Settings(_env_file=env_file)
    app_globals.db_engine = create_engine(app_globals.settings.database_uri, echo=True)

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
