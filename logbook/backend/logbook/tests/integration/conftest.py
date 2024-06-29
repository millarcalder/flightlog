import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from logbook.db.models import Base
from logbook.tests.data.data import insert_testing_data
from logbook.tests.integration import DATABASE_URI


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
