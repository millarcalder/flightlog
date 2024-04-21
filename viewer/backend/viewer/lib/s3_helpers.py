import re

from igc_parser import FlightLog, parse_igc_bytes

from viewer.lib.exceptions import (
    FlightLogNameAlreadyTaken,
    IgcFileNotFound,
    IgcFileTooLarge,
    InvalidFlightLogName,
)


def _valid_key(key: str) -> bool:
    return re.fullmatch(r"^[a-zA-Z\_]{5,}$", key)


def _valid_size_bytes(size_bytes: int, object_size_limit_bytes: int) -> bool:
    return size_bytes <= object_size_limit_bytes


def extract_flight_log_from_s3(
    s3_resource, key: str, bucket: str = "flightlog-igc-files"
) -> FlightLog:
    obj = s3_resource.Object(bucket, key)

    try:
        return parse_igc_bytes(obj.get()["Body"].read())
    except s3_resource.meta.client.exceptions.NoSuchKey as exc:
        raise IgcFileNotFound(key) from exc


def upload_igc_to_s3(
    s3_resource,
    key: str,
    igc: bytes,
    bucket: str = "flightlog-igc-files",
    object_size_limit_bytes: int = 10000000,
):
    obj = s3_resource.Object(bucket, key)

    # Validate the key
    if not _valid_key(key):
        raise InvalidFlightLogName(key)

    # Check the file isn't too large
    if not _valid_size_bytes(len(igc), object_size_limit_bytes):
        raise IgcFileTooLarge(len(igc))

    # Ensure the key doesn't already exist so people can't overwrite each others flights
    try:
        obj.get()
        raise FlightLogNameAlreadyTaken(key)
    except s3_resource.meta.client.exceptions.NoSuchKey:
        ...

    obj.put(Body=igc, ContentType="binary/octet-stream")


def find_objects_to_delete(
    s3_resource,
    bucket: str = "flightlog-igc-files",
    object_size_limit_bytes: int = 10000000,
    object_count_limit: int = 1000,
) -> list[str]:
    objects_to_keep = []
    objects_to_delete = []

    # Check individual object constraints
    for obj in s3_resource.Bucket(bucket).objects.all():
        if not _valid_key(obj.key) or not _valid_size_bytes(
            obj.size, object_size_limit_bytes
        ):
            objects_to_delete.append(obj)
        else:
            objects_to_keep.append(obj)

    # Find the oldest objects over the object count limit
    if len(objects_to_keep) > object_count_limit:
        objects_to_keep.sort(key=lambda x: x.last_modified)

        to = len(objects_to_keep) - object_count_limit
        objects_to_delete = [*objects_to_delete, *objects_to_keep[0:to]]
        del objects_to_keep[0:to]

    return [obj.key for obj in objects_to_delete]


def delete_objects(
    s3_client, objects_to_delete: list[str], bucket: str = "flightlog-igc-files"
):
    s3_client.delete_objects(
        Bucket=bucket, Delete={"Objects": [{"Key": obj} for obj in objects_to_delete]}
    )
