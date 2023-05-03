import boto3
import os
import pytest
from datetime import time
from pathlib import Path
from flightlog.lib.s3_helpers import extract_flight_log_from_s3
from flightlog.lib.s3_helpers import upload_igc_to_s3
from flightlog.lib.exceptions import IgcFileNotFound
from flightlog.lib.exceptions import FlightLogNameAlreadyTaken


test_file_path = f'{Path(os.path.dirname(os.path.realpath(__file__))).parent}/data/230429015259.igc'


@pytest.fixture(scope='session')
def s3_client():
    yield boto3.resource(
        's3',
        endpoint_url='http://localhost:9000/',
        aws_access_key_id='root',
        aws_secret_access_key='1234qwer'
    )


def test_extract_flight_log_from_s3(s3_client):
    flight = extract_flight_log_from_s3(s3_client, 'flightlog-igc-files', 'testing')

    # B2344163749222S17554358EA0067900752
    # B2344173749221S17554353EA0067800752
    flight.position_logs[0] == {
        'log_time': time(23, 44, 16),
        'latitude': 175.9059667,
        'longitude': -37.8203667,
        'altitude': 752
    }
    flight.position_logs[1] == {
        'log_time': time(23, 44, 17),
        'latitude': 175.9058833,
        'longitude': -37.82035,
        'altitude': 752
    }


def test_extract_flight_log_from_s3__object_does_not_exist(s3_client):
    with pytest.raises(IgcFileNotFound):
        extract_flight_log_from_s3(s3_client, 'flightlog-igc-files', 'doesnotexist')


def test_extract_flight_log_from_s3__bucket_does_not_exist(s3_client):
    with pytest.raises(s3_client.meta.client.exceptions.NoSuchBucket):
        extract_flight_log_from_s3(s3_client, 'doesnotexist', 'testing')


def test_upload_igc_to_s3(s3_client):
    with open(test_file_path, 'rb') as file:
        upload_igc_to_s3(s3_client, 'flightlog-igc-files', 'helloworld', file.read())
    s3_client.Object('flightlog-igc-files', 'helloworld').delete()


def test_upload_igc_to_s3__key_already_exists(s3_client):
    with open(test_file_path, 'rb') as file:
        with pytest.raises(FlightLogNameAlreadyTaken):
            upload_igc_to_s3(s3_client, 'flightlog-igc-files', 'testing', file.read())
