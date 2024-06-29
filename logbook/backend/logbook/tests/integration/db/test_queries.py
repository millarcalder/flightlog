import pytest

from logbook.db.models import Site
from logbook.db.queries import (
    InvalidFilter,
    fetch_site,
    fetch_site_by_filters,
    fetch_sites,
)


def test_fetch_sites(db_sess):
    sites = fetch_sites(db_sess)
    assert len(sites) == 3
    assert type(sites[0]) is Site


def test_fetch_sites__filters(db_sess):
    sites = fetch_sites(db_sess, {"country": "Unknown"})
    assert len(sites) == 1
    assert type(sites[0]) is Site
    assert sites[0].name == "Death Star"


def test_fetch_sites__invalid_filter(db_sess):
    with pytest.raises(InvalidFilter):
        fetch_sites(db_sess, {"foo": "bar"})


def test_fetch_site(db_sess):
    site = fetch_site(db_sess, 1)
    assert type(site) is Site
    assert site.name == "Stubai - Elfer"


def test_fetch_site_by_filters(db_sess):
    site = fetch_site_by_filters(db_sess, {"country": "Unknown"})
    assert type(site) is Site
    assert site.name == "Death Star"
