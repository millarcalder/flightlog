from datetime import date, datetime

import pytest
from pydantic import ValidationError

from logbook.models import (
    Flight,
    FlightInput,
    Site,
    validate_altitude,
    validate_latitude,
    validate_longitude,
)


@pytest.mark.parametrize(
    ("func", "val"),
    [
        (validate_latitude, -90),
        (validate_latitude, 90),
        (validate_latitude, 0),
        (validate_latitude, 32.98),
        (validate_latitude, -5.67),
        (validate_longitude, -180),
        (validate_longitude, 180),
        (validate_longitude, 0),
        (validate_longitude, 32.98),
        (validate_longitude, -5.67),
        (validate_altitude, 0),
        (validate_altitude, 100),
    ],
)
def test_validation_functions__valid(func, val):
    assert func(val) == val


@pytest.mark.parametrize(
    ("func", "val"),
    [
        (validate_latitude, 199),
        (validate_latitude, -90.01),
        (validate_longitude, 199),
        (validate_longitude, -180.01),
        (validate_altitude, -1),
    ],
)
def test_validation_functions__invalid(func, val):
    with pytest.raises(AssertionError):
        func(val)


@pytest.mark.parametrize(
    ("model", "kwargs"),
    [
        (
            Site,
            {
                "id": 1,
                "name": "foo",
                "description": "...",
                "latitude": 89,
                "longitude": 128,
                "altitude": 12,
                "country": "New Zealand",
            },
        ),
        (
            FlightInput,
            {
                "date_of_flight": date(2024, 1, 1),
                "site_id": 1,
                "glider_id": 1,
                "start_time": datetime(2024, 1, 1, 12, 0),
                "stop_time": datetime(2024, 1, 1, 13, 0),
            },
        ),
        (
            Flight,
            {
                "id": 1,
                "date_of_flight": date(2024, 1, 1),
                "user_id": 1,
                "site_id": 1,
                "glider_id": 1,
                "start_time": datetime(2024, 1, 1, 12, 0),
                "stop_time": datetime(2024, 1, 1, 13, 0),
            },
        ),
    ],
)
def test_models__valid(model, kwargs):
    m = model(**kwargs)
    for key, val in kwargs.items():
        assert getattr(m, key) == val


@pytest.mark.parametrize(
    ("model", "kwargs"),
    [
        (
            Site,
            {
                "id": 1,
                "name": "foo",
                "description": "...",
                "latitude": 99,
                "longitude": 128,
                "altitude": 12,
                "country": "New Zealand",
            },
        ),
        (
            Site,
            {
                "id": 1,
                "name": "foo",
                "description": "...",
                "latitude": 89,
                "longitude": 199,
                "altitude": 12,
                "country": "New Zealand",
            },
        ),
        (
            Site,
            {
                "id": 1,
                "name": "foo",
                "description": "...",
                "latitude": 89,
                "longitude": 128,
                "altitude": 12.12,
                "country": "New Zealand",
            },
        ),
    ],
)
def test_models__invalid(model, kwargs):
    with pytest.raises(ValidationError, match=r"1 validation error .*"):
        model(**kwargs)

    assert True
