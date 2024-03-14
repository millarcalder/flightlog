import click
import logging
import os
import uvicorn

from logbook.config import Settings
from logbook.webapp.app import init_app


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
