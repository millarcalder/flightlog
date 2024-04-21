import pytest

import logbook.webapp.app_globals as app_globals


@pytest.fixture(autouse=True)
def setup_globals(db_engine):
    """
    Configures the global variables required by graphql which are usually
    initialized by the webapp.
    """
    app_globals.db_engine = db_engine
