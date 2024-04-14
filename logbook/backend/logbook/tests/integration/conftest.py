import pytest

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from logbook.tests.integration import DATABASE_URI
from logbook.lib.data_models import Base
from fastapi.testclient import TestClient
from logbook.webapp.app import init_app
from logbook.tests.data.data import insert_testing_data


@pytest.fixture(autouse=True)
def db_engine():
    engine = create_engine(DATABASE_URI, echo=True)
    Base.metadata.create_all(engine)
    with Session(engine) as sess:
        insert_testing_data(sess)
        sess.commit()
    yield engine
    Base.metadata.drop_all(engine)
    engine.dispose()


@pytest.fixture(scope='session')
def client():
    app = init_app()
    yield TestClient(app)
