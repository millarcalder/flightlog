import pytest
from datetime import timedelta
from logbook.webapp.auth import _create_access_token


@pytest.fixture(scope='function')
def access_token():
    return _create_access_token(data={"sub": 'millar9819@gmail.com'}, expires_delta=timedelta(minutes=1))
