import pytest
from datetime import timedelta
from fastapi.testclient import TestClient
from logbook.webapp.auth import _create_access_token
from logbook.webapp.app import init_app


@pytest.fixture(scope='function')
def access_token():
    return _create_access_token(data={"sub": 'millar9819@gmail.com'}, expires_delta=timedelta(minutes=1))


@pytest.fixture(scope='session')
def client():
    app = init_app()
    yield TestClient(app)
