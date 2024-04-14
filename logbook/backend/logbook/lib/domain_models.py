from datetime import date
from datetime import datetime
from typing_extensions import Annotated
from pydantic import BaseModel
from pydantic import ConfigDict
from pydantic.functional_validators import AfterValidator


def validate_latitude(val: float) -> float:
    assert -90 <= val <= 90, f'{val} is not a valid latitude'
    return val

def validate_longitude(val: float) -> float:
    assert -180 <= val <= 180, f'{val} is not a valid longitude'
    return val

def validate_altitude(val: int) -> int:
    assert val >= 0, f'{val} is not a valid altitude'
    return val

Latitude = Annotated[float, AfterValidator(validate_latitude)]
Longitude = Annotated[float, AfterValidator(validate_longitude)]
Altitude = Annotated[int, AfterValidator(validate_altitude)]


class Site(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str
    latitude: Latitude
    longitude: Longitude
    altitude: Altitude
    country: str


class User(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    first_name: str
    last_name: str


class Glider(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    model: str
    manufacturer: str
    rating: str


class Flight(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    date_of_flight: date
    user_id: int
    site_id: int
    glider_id: int
    start_time: datetime
    stop_time: datetime
    max_altitude: Altitude|None
    wind_speed: float|None
    wind_dir: float|None
    comments: str
    igc_s3: str|None
    flightlog_viewer_link: str|None
