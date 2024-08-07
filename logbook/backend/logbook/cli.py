import logging

import click
import uvicorn
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

import logbook.webapp.dependencies  # noqa: F401
from logbook.auth import fetch_user
from logbook.db.models import Base


def _create_testing_db_engine():
    return create_engine("sqlite:///testing.db")


def _setup_auto_auth():
    """
    patches the fastapi dependency which decodes the oauth JWT token.
    """
    import pytest

    import logbook.webapp.routers.auth

    engine = _create_testing_db_engine()

    def _get_current_user():
        with Session(engine) as sess:
            return fetch_user("chewie@gmail.com", sess)

    pytest.MonkeyPatch().setattr(
        logbook.webapp.dependencies, "get_current_user", _get_current_user
    )


@click.group()
@click.argument("env", type=str)
def cli(env: str):
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.DEBUG)
    formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")

    if env in ("testing"):
        stream_handler = logging.StreamHandler()
        stream_handler.setLevel(logging.DEBUG)
        stream_handler.setFormatter(formatter)
        root_logger.addHandler(stream_handler)
    elif env in ("production", "staging", "local"):
        file_handler = logging.FileHandler("test.log")
        file_handler.setLevel(logging.WARNING)
        file_handler.setFormatter(formatter)
        root_logger.addHandler(file_handler)


@cli.command(help="Destroy the test database")
@click.option("--fake-data", is_flag=True)
def test_db_up(fake_data: bool):
    # Import here so these aren't imported in production
    from logbook.tests.data.data import generate_fake_testing_data, insert_testing_data
    engine = _create_testing_db_engine()
    Base.metadata.create_all(engine)
    with Session(engine) as sess:
        if fake_data:
            generate_fake_testing_data(sess)
        else:
            insert_testing_data(sess)
    engine.dispose()


@cli.command(help="Create and populate the test database")
def test_db_down():
    engine = _create_testing_db_engine()
    Base.metadata.drop_all(engine)
    engine.dispose()


@cli.command(help="Run the web application")
@click.option("--env-file", help="Specify the file to load environment variables from")
@click.option(
    "--auto-auth",
    is_flag=True,
    help="Useful for development - automatically login as the user chewie@gmail.com",
)
@click.option(
    "--reload",
    is_flag=True,
    help="Useful for development - reloads the webapp when source code is changed",
)
@click.option(
    "--debug",
    is_flag=True,
    help="Useful for development - starts debugpy listening on port 5678",
)
def run_webapp(reload: bool, auto_auth: bool, debug: bool, env_file: str | None = None):
    if debug:
        import debugpy  # type: ignore

        debugpy.listen(("localhost", 5678))
        debugpy.wait_for_client()

    if auto_auth:
        _logger = logging.getLogger()
        _logger.warning("Running the webapp in auto-auth mode")
        _setup_auto_auth()

    from logbook.webapp.app import init_app

    app = init_app(env_file)
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=5000,
        log_level=logging.INFO,
        reload=reload,
    )
