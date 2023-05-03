import re
from flightlog.lib.exceptions import InvalidFlightLogName
from flightlog.lib.exceptions import IgcFileNotFound
from flightlog.lib.exceptions import FlightLogNameAlreadyTaken
from flightlog.lib.igc_parser import FlightLog
from flightlog.lib.igc_parser import parse_igc_bytes


def extract_flight_log_from_s3(s3_client, bucket: str, key: str) -> FlightLog:
    obj = s3_client.Object(bucket, key)

    try:
        return parse_igc_bytes(obj.get()["Body"].read())
    except s3_client.meta.client.exceptions.NoSuchKey as exc:
        raise IgcFileNotFound(key) from exc


def upload_igc_to_s3(s3_client, bucket: str, key: str, igc: bytes):
    obj = s3_client.Object(bucket, key)

    # Validate the key
    if not re.fullmatch("^[a-zA-Z\_]{5,}$", key):
        raise InvalidFlightLogName(key)

    # Ensure the key doesn't already exist so people can't overwrite each others flights
    try:
        obj.get()
        raise FlightLogNameAlreadyTaken(key)
    except s3_client.meta.client.exceptions.NoSuchKey:
        ...

    obj.put(Body=igc, ContentType="binary/octet-stream")
