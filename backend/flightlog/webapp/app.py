import boto3

from fastapi import Depends
from fastapi import FastAPI
from fastapi import File
from fastapi.middleware.cors import CORSMiddleware

from flightlog.config import Settings
from flightlog.lib.igc_parser import parse_igc_bytes
from flightlog.lib.s3_helpers import extract_flight_log_from_s3
from flightlog.lib.s3_helpers import upload_igc_to_s3


settings = Settings()
app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _s3_client():
    return boto3.resource(
        "s3",
        endpoint_url=settings.s3_endpoint_url,
        aws_access_key_id=settings.aws_access_key_id,
        aws_secret_access_key=settings.aws_secret_access_key,
    )


@app.post("/extract-flight-log/file")
def extract_points_from_igc(igc: bytes = File()):
    return parse_igc_bytes(igc)


@app.get("/extract-flight-log/s3/{key}")
def extract_flight_log_s3(key: str, s3_client=Depends(_s3_client)):
    return extract_flight_log_from_s3(s3_client, key)


@app.post("/upload-igc/s3/{key}")
def upload_igc_s3(key: str, igc: bytes = File(), s3_client=Depends(_s3_client)):
    upload_igc_to_s3(s3_client, key, igc)
