from datetime import timedelta

import pytest
from fastapi.testclient import TestClient

import logbook.webapp.app_globals as app_globals
from logbook.auth import TokenData, generate_access_token
from logbook.webapp.app import init_app


@pytest.fixture(scope="function")
def access_token_chewie():
    return generate_access_token(
        data=TokenData(sub="chewie@gmail.com"),
        expires_delta=timedelta(minutes=1),
        secret_key=app_globals.settings.password_hash_secret_key,
        algorithm=app_globals.settings.password_hash_algorithm,
    )


@pytest.fixture(scope="function")
def access_token_lukeskywalker():
    return generate_access_token(
        data=TokenData(sub="lukeskywalker@gmail.com"),
        expires_delta=timedelta(minutes=1),
        secret_key=app_globals.settings.password_hash_secret_key,
        algorithm=app_globals.settings.password_hash_algorithm,
    )


@pytest.fixture(scope="session")
def client():
    app = init_app()
    yield TestClient(app)
