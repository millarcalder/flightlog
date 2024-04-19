import pytest

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from logbook.tests.integration import DATABASE_URI
from logbook.lib.data_models import Base
from logbook.tests.data.data import insert_testing_data


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
