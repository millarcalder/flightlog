import boto3
import pytest

from viewer.tests import TEST_FILES_DIR, TEST_S3_BUCKET


@pytest.fixture(scope="session")
def s3_resource():
    yield boto3.resource(
        "s3",
        endpoint_url="http://flightlog-s3:9000/",
        aws_access_key_id="root",
        aws_secret_access_key="1234qwer",
    )


@pytest.fixture(scope="session")
def s3_client():
    yield boto3.client(
        "s3",
        endpoint_url="http://flightlog-s3:9000/",
        aws_access_key_id="root",
        aws_secret_access_key="1234qwer",
    )


@pytest.fixture(scope="function")
def upload_s3_object(request, s3_client, s3_resource):
    obj = s3_resource.Object(TEST_S3_BUCKET, request.param[1])
    with open(f"{TEST_FILES_DIR}/{request.param[0]}", "rb") as file:
        obj.put(Body=file.read(), ContentType="binary/octet-stream")

    yield request.param

    s3_client.delete_objects(
        Bucket=TEST_S3_BUCKET, Delete={"Objects": [{"Key": request.param[1]}]}
    )


@pytest.fixture(scope="function")
def upload_s3_objects(request, s3_client, s3_resource):
    for igc_file in request.param:
        obj = s3_resource.Object(TEST_S3_BUCKET, igc_file[1])
        with open(f"{TEST_FILES_DIR}/{igc_file[0]}", "rb") as file:
            obj.put(Body=file.read(), ContentType="binary/octet-stream")

    yield request.param

    s3_client.delete_objects(
        Bucket=TEST_S3_BUCKET,
        Delete={"Objects": [{"Key": igc_file[1]} for igc_file in request.param]},
    )


@pytest.fixture(scope="function")
def delete_s3_object(request, s3_client, s3_resource):
    yield request.param
    s3_client.delete_objects(
        Bucket=TEST_S3_BUCKET, Delete={"Objects": [{"Key": request.param[1]}]}
    )


@pytest.fixture(scope="function")
def delete_s3_objects(request, s3_client, s3_resource):
    yield request.param
    s3_client.delete_objects(
        Bucket=TEST_S3_BUCKET,
        Delete={"Objects": [{"Key": igc_file[1]} for igc_file in request.param]},
    )
