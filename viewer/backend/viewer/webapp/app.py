import os
from pathlib import Path

import boto3
from fastapi import Depends, FastAPI, File
from fastapi.middleware.cors import CORSMiddleware
from igc_parser import parse_igc_bytes

import viewer.webapp.app_globals as app_globals
from viewer.config import Settings
from viewer.lib.s3_helpers import extract_flight_log_from_s3, upload_igc_to_s3

app = FastAPI()


def init_app(env_file=None) -> FastAPI:
    # _env_file kwarg causes issue with mypy
    # more details here https://github.com/pydantic/pydantic/issues/3072
    app_globals.settings = Settings(_env_file=env_file)  # type: ignore

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return app


def _s3_client():
    return boto3.resource(
        "s3",
        endpoint_url=app_globals.settings.s3_endpoint_url,
        aws_access_key_id=app_globals.settings.aws_access_key_id,
        aws_secret_access_key=app_globals.settings.aws_secret_access_key,
    )


@app.post("/extract-flight-log/file")
def extract_points_from_igc(igc: bytes = File()):
    return parse_igc_bytes(igc)


@app.get("/extract-flight-log/s3/{key}")
def extract_flight_log_s3(key: str, s3_client=Depends(_s3_client)):
    return extract_flight_log_from_s3(s3_client, key)


@app.get("/extract-flight-log/example")
def extract_flight_log_example():
    with open(
        f"{Path(os.path.dirname(os.path.realpath(__file__))).parent}/data/example.igc",
        "rb",
    ) as file:
        return parse_igc_bytes(file.read())


@app.post("/upload-igc/s3/{key}")
def upload_igc_s3(key: str, igc: bytes = File(), s3_client=Depends(_s3_client)):
    upload_igc_to_s3(s3_client, key, igc)
