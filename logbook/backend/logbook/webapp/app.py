from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from strawberry.fastapi import GraphQLRouter

import logbook.webapp.app_globals as app_globals
from logbook.config import Settings
from logbook.graphql.schema import CustomContext, schema
from logbook.webapp.dependencies import get_current_user, get_db_sess
from logbook.webapp.routers.api import router as api_router
from logbook.webapp.routers.auth import router as auth_router


@asynccontextmanager
async def _lifespan(app: FastAPI):
    yield
    app_globals.db_engine.dispose()


async def _graphql_context(
    current_user=Depends(get_current_user), db_sess=Depends(get_db_sess)
):
    """
    sets up the GraphQL context
    """
    return CustomContext(current_user.id, db_sess)


app = FastAPI(lifespan=_lifespan)
app.include_router(
    GraphQLRouter(schema, context_getter=_graphql_context), prefix="/graphql"
)
app.include_router(api_router)
app.include_router(auth_router)


def init_app(env_file=None) -> FastAPI:
    # _env_file kwarg causes issue with mypy
    # more details here https://github.com/pydantic/pydantic/issues/3072
    app_globals.settings = Settings(_env_file=env_file)  # type: ignore
    app_globals.db_engine = create_engine(app_globals.settings.database_uri, echo=True)

    origins = ["*"]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return app


@app.get("/health")
def health():
    return {}
