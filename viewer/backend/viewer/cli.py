import logging
import os

import boto3
import click
import uvicorn

from viewer.config import Settings
from viewer.lib.s3_helpers import delete_objects, find_objects_to_delete
from viewer.webapp.app import init_app


@click.group()
@click.argument("env", type=str)
def cli(env: str):
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.DEBUG)
    formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")

    if env in ("local", "testing"):
        os.environ["s3_endpoint_url"] = "http://localhost:9000/"
        os.environ["aws_access_key_id"] = "root"
        os.environ["aws_secret_access_key"] = "1234qwer"

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


@cli.command()
@click.option("--dry", is_flag=True)
@click.option("--object-size-limit-bytes", type=int)
@click.option("--object-count-limit", type=int)
def clean_bucket(
    dry: bool,
    object_size_limit_bytes: int | None = None,
    object_count_limit: int | None = None,
):
    settings = Settings()
    s3_resource = boto3.resource(
        "s3",
        endpoint_url=settings.s3_endpoint_url,
        aws_access_key_id=settings.aws_access_key_id,
        aws_secret_access_key=settings.aws_secret_access_key,
    )
    s3_client = boto3.client(
        "s3",
        endpoint_url=settings.s3_endpoint_url,
        aws_access_key_id=settings.aws_access_key_id,
        aws_secret_access_key=settings.aws_secret_access_key,
    )

    kwargs = {}
    if object_size_limit_bytes is not None:
        kwargs["object_size_limit_bytes"] = object_size_limit_bytes
    if object_count_limit is not None:
        kwargs["object_count_limit"] = object_count_limit
    objects_to_delete = find_objects_to_delete(s3_resource, **kwargs)

    print(
        f"This command will delete {len(objects_to_delete)} objects: {objects_to_delete}"
    )

    if not dry:
        click.confirm("Are you sure you want to proceed?")
        delete_objects(s3_client, objects_to_delete)
