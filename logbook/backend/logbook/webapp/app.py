import logbook.webapp.app_globals as app_globals

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi import Depends
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
from sqlalchemy import create_engine

from logbook.config import Settings
from logbook.webapp.auth import router as auth_router
from logbook.webapp.auth import get_current_user
from logbook.lib.graphql_schema import schema
from logbook.lib.graphql_schema import CustomContext


@asynccontextmanager
async def _lifespan(app: FastAPI):
    yield
    app_globals.db_engine.dispose()


async def _graphql_context(current_user = Depends(get_current_user)):
    """
    sets up the GraphQL context
    """
    return CustomContext(current_user.id)


app = FastAPI(lifespan=_lifespan)
app.include_router(GraphQLRouter(schema, context_getter=_graphql_context), prefix='/graphql')
app.include_router(auth_router)


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
