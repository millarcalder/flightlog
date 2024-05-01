import pytest

from logbook.graphql.schema import CustomContext


@pytest.fixture
def context(db_sess):
    yield CustomContext(1, db_sess)
