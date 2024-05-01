from datetime import timedelta

import pytest
from fastapi.testclient import TestClient

import logbook.webapp.app_globals as app_globals
from logbook.auth import TokenData, generate_access_token
from logbook.webapp.app import init_app


@pytest.fixture(scope="function")
def access_token():
    return generate_access_token(
        data=TokenData(sub="millar9819@gmail.com"),
        expires_delta=timedelta(minutes=1),
        secret_key=app_globals.settings.password_hash_secret_key,
        algorithm=app_globals.settings.password_hash_algorithm,
    )


@pytest.fixture(scope="session")
def client():
    app = init_app()
    yield TestClient(app)
