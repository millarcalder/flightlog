import pytest
from datetime import time
from viewer.lib.s3_helpers import extract_flight_log_from_s3
from viewer.lib.s3_helpers import find_objects_to_delete
from viewer.lib.s3_helpers import upload_igc_to_s3
from viewer.lib.exceptions import FlightLogNameAlreadyTaken
from viewer.lib.exceptions import IgcFileNotFound
from viewer.tests import TEST_FILES_DIR


@pytest.mark.parametrize(
    "upload_s3_object", [(["220415234416.igc", "testing"])], indirect=True
)
def test_extract_flight_log_from_s3(s3_resource, upload_s3_object):
    flightlog = extract_flight_log_from_s3(s3_resource, upload_s3_object[1])

    # B2344163749222S17554358EA0067900752
    # B2344173749221S17554353EA0067800752
    assert flightlog.position_logs[0] == {
        "log_time": time(23, 44, 16),
        "latitude": -37.8203667,
        "longitude": 175.9059667,
        "altitude": 752,
    }
    assert flightlog.position_logs[1] == {
        "log_time": time(23, 44, 17),
        "latitude": -37.82035,
        "longitude": 175.9058833,
        "altitude": 752,
    }


def test_extract_flight_log_from_s3__object_does_not_exist(s3_resource):
    with pytest.raises(IgcFileNotFound):
        extract_flight_log_from_s3(s3_resource, "doesnotexist")


def test_extract_flight_log_from_s3__bucket_does_not_exist(s3_resource):
    with pytest.raises(s3_resource.meta.client.exceptions.NoSuchBucket):
        extract_flight_log_from_s3(s3_resource, "doesnotexist", "testone")


@pytest.mark.parametrize(
    "delete_s3_object", [(["230429015259.igc", "testing"])], indirect=True
)
def test_upload_igc_to_s3(s3_resource, delete_s3_object):
    igc_file = delete_s3_object[0]
    key = delete_s3_object[1]

    # Upload the flightlog
    with open(f"{TEST_FILES_DIR}/{igc_file}", "rb") as file:
        upload_igc_to_s3(s3_resource, key, file.read())

    # Check the uploaded flightlog
    flightlog = extract_flight_log_from_s3(s3_resource, key)

    # B0152594101939S17452697EA0009300193
    # B0153004101937S17452697EA0009500194
    assert flightlog.position_logs[0] == {
        "log_time": time(1, 52, 59),
        "latitude": -41.0323167,
        "longitude": 174.8782833,
        "altitude": 193,
    }
    assert flightlog.position_logs[1] == {
        "log_time": time(1, 53, 00),
        "latitude": -41.0322833,
        "longitude": 174.8782833,
        "altitude": 194,
    }


@pytest.mark.parametrize(
    "upload_s3_object", [(["220415234416.igc", "testing"])], indirect=True
)
def test_upload_igc_to_s3__key_already_exists(s3_resource, upload_s3_object):
    with open(f"{TEST_FILES_DIR}/{upload_s3_object[0]}", "rb") as file:
        with pytest.raises(FlightLogNameAlreadyTaken):
            upload_igc_to_s3(s3_resource, upload_s3_object[1], file.read())


@pytest.mark.parametrize(
    "upload_s3_objects",
    [
        (
            [
                ["220415234416.igc", "testone"],
                ["220415234416.igc", "testtwo"],
                ["230429015259.igc", "testthree"],
            ]
        )
    ],
    indirect=True,
)
def test_find_objects_to_delete(s3_resource, upload_s3_objects):
    assert find_objects_to_delete(
        s3_resource, object_size_limit_bytes=100000, object_count_limit=1
    ) == ["testthree", "testone"]
    assert find_objects_to_delete(s3_resource, object_count_limit=0) == [
        "testone",
        "testtwo",
        "testthree",
    ]
    assert find_objects_to_delete(s3_resource, object_size_limit_bytes=0) == [
        "testone",
        "testthree",
        "testtwo",
    ]
