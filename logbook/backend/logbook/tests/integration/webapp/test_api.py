import os
from pathlib import Path

import botocore
import botocore.errorfactory
import botocore.exceptions
import pytest

from logbook.tests.integration import IGC_FILES_BUCKET

test_file_path = (
    f"{Path(os.path.dirname(os.path.realpath(__file__))).parents[5]}"
    "/data/220415234416.igc"
)


def test_post_flight(client, access_token_chewie):
    res = client.post(
        "/api/flight",
        json={
            "dateOfFlight": "2021-01-01",
            "siteId": 1,
            "gliderId": 1,
            "startTime": "2021-01-01T12:00:00",
            "stopTime": "2021-01-01T12:30:00",
            "maxAltitude": 100,
            "windSpeed": 10,
            "windDir": 12.23,
            "comments": "...",
        },
        headers={"Authorization": f"Bearer {access_token_chewie.access_token}"},
    )
    assert res.status_code == 200
    assert res.json() == {
        "id": 3,
        "userId": 1,
        "dateOfFlight": "2021-01-01",
        "siteId": 1,
        "gliderId": 1,
        "startTime": "2021-01-01T12:00:00",
        "stopTime": "2021-01-01T12:30:00",
        "maxAltitude": 100,
        "windSpeed": 10,
        "windDir": 12.23,
        "comments": "...",
    }


def test_post_glider(client, access_token_chewie):
    res = client.post(
        "/api/glider",
        json={"model": "FOO", "manufacturer": "BAR", "rating": "Z"},
        headers={"Authorization": f"Bearer {access_token_chewie.access_token}"},
    )
    assert res.status_code == 200
    assert res.json() == {
        "id": 3,
        "userId": 1,
        "model": "FOO",
        "manufacturer": "BAR",
        "rating": "Z",
    }


def test_post_site(client, access_token_chewie):
    res = client.post(
        "/api/site",
        json={
            "name": "FOO",
            "description": "BAR",
            "latitude": 12.34,
            "longitude": 123.45,
            "altitude": 100,
            "country": "Pandora",
        },
        headers={"Authorization": f"Bearer {access_token_chewie.access_token}"},
    )
    assert res.status_code == 200
    assert res.json() == {
        "id": 4,
        "name": "FOO",
        "description": "BAR",
        "latitude": 12.34,
        "longitude": 123.45,
        "altitude": 100,
        "country": "Pandora",
    }


def test_upload_igc(client, access_token_chewie, s3_resource):
    # Add flight
    res = client.post(
        "/api/flight",
        json={
            "dateOfFlight": "2021-01-01",
            "siteId": 1,
            "gliderId": 1,
            "startTime": "2021-01-01T12:00:00",
            "stopTime": "2021-01-01T12:30:00",
            "maxAltitude": 100,
            "windSpeed": 10,
            "windDir": 12.23,
            "comments": "...",
        },
        headers={"Authorization": f"Bearer {access_token_chewie.access_token}"},
    )
    assert res.status_code == 200
    flight_id = res.json()["id"]

    # Upload IGC file
    with open(test_file_path, "rb") as file:
        igc = file.read()
    res = client.put(
        f"/api/flight/{flight_id}/upload-igc",
        headers={"Authorization": f"Bearer {access_token_chewie.access_token}"},
        files={"igc": igc},
    )
    assert res.status_code == 200

    # Check IGC file was added to S3
    assert s3_resource.Object(IGC_FILES_BUCKET, f"{flight_id}").get()


def test_upload_igc__unauthorized(
    client, access_token_chewie, access_token_lukeskywalker, s3_resource
):
    # Add flight
    res = client.post(
        "/api/flight",
        json={
            "dateOfFlight": "2021-01-01",
            "siteId": 1,
            "gliderId": 1,
            "startTime": "2021-01-01T12:00:00",
            "stopTime": "2021-01-01T12:30:00",
            "maxAltitude": 100,
            "windSpeed": 10,
            "windDir": 12.23,
            "comments": "...",
        },
        headers={"Authorization": f"Bearer {access_token_chewie.access_token}"},
    )
    assert res.status_code == 200
    flight_id = res.json()["id"]

    # Upload IGC file
    with open(test_file_path, "rb") as file:
        igc = file.read()
    res = client.put(
        f"/api/flight/{flight_id}/upload-igc",
        headers={"Authorization": f"Bearer {access_token_lukeskywalker.access_token}"},
        files={"igc": igc},
    )
    assert res.status_code == 404

    # Check IGC file was not added to S3
    with pytest.raises(botocore.exceptions.ClientError):
        assert s3_resource.Object(IGC_FILES_BUCKET, f"{flight_id}").get()
