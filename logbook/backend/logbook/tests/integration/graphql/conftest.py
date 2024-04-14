import pytest
import logbook.webapp.app_globals as app_globals


@pytest.fixture(autouse=True)
def setup_globals(db_engine):
    app_globals.db_engine = db_engine
