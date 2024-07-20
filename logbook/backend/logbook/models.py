from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field
from pydantic.functional_validators import AfterValidator
from typing_extensions import Annotated


def validate_latitude(val: float) -> float:
    assert -90 <= val <= 90, f"{val} is not a valid latitude"
    return val


def validate_longitude(val: float) -> float:
    assert -180 <= val <= 180, f"{val} is not a valid longitude"
    return val


def validate_altitude(val: int) -> int:
    assert val >= 0, f"{val} is not a valid altitude"
    return val


Latitude = Annotated[float, AfterValidator(validate_latitude)]
Longitude = Annotated[float, AfterValidator(validate_longitude)]
Altitude = Annotated[int, AfterValidator(validate_altitude)]


class SiteInput(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str
    description: str
    latitude: Latitude
    longitude: Longitude
    altitude: Altitude
    country: str


class Site(SiteInput):
    id: int


class User(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email_address: str
    first_name: str
    last_name: str
    hashed_password: str


class GliderInput(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    model: str
    manufacturer: str
    rating: str


class Glider(GliderInput):
    id: int
    user_id: int


class FlightInput(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    date_of_flight: date
    site_id: int
    glider_id: int
    start_time: datetime
    stop_time: datetime
    max_altitude: Altitude | None = Field(default=None)
    wind_speed: float | None = Field(default=None)
    wind_dir: float | None = Field(default=None)
    comments: str = Field(default="")
    igc_s3: str | None = Field(default=None)
    flightlog_viewer_link: str | None = Field(default=None)


class Flight(FlightInput):
    id: int
    user_id: int
