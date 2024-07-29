import boto3
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from logbook.db.models import Base
from logbook.tests.data.data import insert_testing_data
from logbook.tests.integration import (
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    DATABASE_URI,
    IGC_FILES_BUCKET,
    S3_ENDPOINT_URL,
)


@pytest.fixture(autouse=True)
def db_engine():
    """Initialize the database automatically for all integration tests"""
    engine = create_engine(DATABASE_URI, echo=True)
    Base.metadata.create_all(engine)
    with Session(engine) as sess:
        insert_testing_data(sess)
        sess.commit()
    yield engine
    Base.metadata.drop_all(engine)
    engine.dispose()


@pytest.fixture(scope="function")
def db_sess(db_engine):
    with Session(db_engine) as sess:
        yield sess


@pytest.fixture(scope="function")
def s3_resource():
    resource = boto3.resource(
        "s3",
        endpoint_url=S3_ENDPOINT_URL,
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    )
    yield resource
    bucket = resource.Bucket(IGC_FILES_BUCKET)
    bucket.objects.all().delete()
