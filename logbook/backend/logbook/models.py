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
    emailAddress: str
    firstName: str
    lastName: str
    hashedPassword: str


class GliderInput(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    model: str
    manufacturer: str
    rating: str


class Glider(GliderInput):
    id: int
    userId: int


class FlightInput(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    dateOfFlight: date
    siteId: int
    gliderId: int
    startTime: datetime
    stopTime: datetime
    maxAltitude: Altitude | None = Field(default=None)
    windSpeed: float | None = Field(default=None)
    windDir: float | None = Field(default=None)
    comments: str = Field(default="")


class Flight(FlightInput):
    id: int
    userId: int

    glider: Glider | None = Field(default=None)
