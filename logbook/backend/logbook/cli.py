import click
import logging
import uvicorn

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from logbook.webapp.app import init_app
from logbook.tests.data.data import insert_testing_data
from logbook.backend.logbook.lib.data_models import Base


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


@cli.command()
def test_db_up():
    engine = create_engine("postgresql+psycopg://root:secret@flightlog-db:5432/logbook", echo=True)
    Base.metadata.create_all(engine)
    with Session(engine) as sess:
        insert_testing_data(sess)
        sess.commit()
    engine.dispose()


@cli.command()
def test_db_down():
    engine = create_engine("postgresql+psycopg://root:secret@flightlog-db:5432/logbook", echo=True)
    Base.metadata.drop_all(engine)
    engine.dispose()


@cli.command()
@click.option("--env-file")
@click.option("--reload", is_flag=True)
def run_webapp(reload: bool, env_file: str | None = None):
    app = init_app(env_file)
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=5000,
        log_level=logging.INFO,
        reload=reload,
    )
