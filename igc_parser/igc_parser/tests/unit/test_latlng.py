import pytest

from igc_parser.exceptions import InvalidLatLng
from igc_parser.latlng import haversine


@pytest.mark.parametrize(
    ("lat1", "lng1", "lat2", "lng2", "expected_dist"),
    [
        (90, 180, 90, 180, 0),
        (0, 0, 0, 0, 0),
        (-1, 0, 0, 0, 111195),
        (1, 0, 0, 0, 111195),
        (90, 180, -90, -180, 20015087),
    ],
)
def test_haversine_valid(lat1, lng1, lat2, lng2, expected_dist):
    # There are probably some rounding errors in the function which are fine for the
    # purposes of this application so let's just assert approx here
    assert haversine(lat1, lng1, lat2, lng2) == pytest.approx(expected_dist)


@pytest.mark.parametrize(
    ("lat1", "lng1", "lat2", "lng2"),
    [
        (100, 0, 0, 0),
        (-100, 0, 0, 0),
        (0, 200, 0, 0),
        (0, -200, 0, 0),
        (0, 0, 100, 0),
        (0, 0, -100, 0),
        (0, 0, 0, 200),
        (0, 0, 0, -200),
    ],
)
def test_haversine_invalid(lat1, lng1, lat2, lng2):
    with pytest.raises(InvalidLatLng):
        haversine(lat1, lng1, lat2, lng2)
