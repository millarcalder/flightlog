from datetime import date, datetime
from typing import Type, TypeVar

import strawberry
from pydantic import BaseModel
from sqlalchemy.orm import Session
from strawberry.fastapi import BaseContext

from logbook.db.models import Base
from logbook.db.queries import (
    fetch_flights,
    fetch_glider_by_filters,
    fetch_gliders,
    fetch_site,
    fetch_sites,
)
from logbook.db.models import Flight as FlightOrm
from logbook.models import FlightInput as FlightInput
from logbook.models import Flight as FlightModel
from logbook.models import Glider as GliderModel
from logbook.models import Site as SiteModel


Model = TypeVar("Model", bound=BaseModel)


def _sqlalchemy_to_graphql_model(
    obj: Base, pydantic_model: Type[Model], graphql_model: strawberry.type
) -> Model:
    return graphql_model(**pydantic_model.model_validate(obj).model_dump())


class CustomContext(BaseContext):
    def __init__(self, user_id: int, db_sess: Session):
        self.user_id = user_id
        self.db_sess = db_sess


def get_site_for_flight(info: strawberry.Info, root: "Flight") -> "Site":
    site = fetch_site(info.context.db_sess, root.site_id)
    return _sqlalchemy_to_graphql_model(site, SiteModel, Site)


def get_glider_for_flight(info: strawberry.Info, root: "Flight") -> "Glider":
    glider = fetch_glider_by_filters(
        info.context.db_sess,
        filters={"id": root.glider_id, "user_id": info.context.user_id},
    )
    return _sqlalchemy_to_graphql_model(glider, GliderModel, Glider)


def get_flights_for_site(info: strawberry.Info, root: "Site") -> list["Flight"]:
    flights = fetch_flights(
        info.context.db_sess,
        filters={"site_id": root.id, "user_id": info.context.user_id},
    )
    return [_sqlalchemy_to_graphql_model(f, FlightModel, Flight) for f in flights]


def get_flights_for_glider(info: strawberry.Info, root: "Glider") -> list["Flight"]:
    flights = fetch_flights(
        info.context.db_sess,
        filters={"glider_id": root.id, "user_id": info.context.user_id},
    )
    return [_sqlalchemy_to_graphql_model(f, FlightModel, Flight) for f in flights]


def get_sites(info: strawberry.Info, country: str | None = None) -> list["Site"]:
    filters = {}
    if country:
        filters["country"] = country
    sites = fetch_sites(info.context.db_sess, filters)
    return [_sqlalchemy_to_graphql_model(s, SiteModel, Site) for s in sites]


def get_gliders(info: strawberry.Info) -> list["Glider"]:
    gliders = fetch_gliders(
        info.context.db_sess, filters={"user_id": info.context.user_id}
    )
    return [_sqlalchemy_to_graphql_model(g, GliderModel, Glider) for g in gliders]


def get_flights(info: strawberry.Info) -> list["Flight"]:
    flights = fetch_flights(
        info.context.db_sess, filters={"user_id": info.context.user_id}
    )
    return [_sqlalchemy_to_graphql_model(f, FlightModel, Flight) for f in flights]


@strawberry.type
class Site:
    id: int
    name: str
    description: str
    latitude: float
    longitude: float
    altitude: int
    country: str

    flights: list["Flight"] = strawberry.field(resolver=get_flights_for_site)


@strawberry.type
class Glider:
    id: int
    user_id: int
    model: str
    manufacturer: str
    rating: str

    flights: list["Flight"] = strawberry.field(resolver=get_flights_for_glider)


@strawberry.type
class Flight:
    id: int
    date_of_flight: date
    user_id: int
    site_id: int
    glider_id: int
    start_time: datetime
    stop_time: datetime
    max_altitude: int | None
    wind_speed: float | None
    wind_dir: float | None
    comments: str
    igc_s3: str | None
    flightlog_viewer_link: str | None

    glider: Glider = strawberry.field(resolver=get_glider_for_flight)
    site: Site = strawberry.field(resolver=get_site_for_flight)


@strawberry.type
class FlightMutations:
    @strawberry.mutation
    def add(
        self,
        info: strawberry.Info,
        date_of_flight: date,
        user_id: int,
        site_id: int,
        glider_id: int,
        start_time: datetime,
        stop_time: datetime,
        max_altitude: int | None = None,
        wind_speed: float | None = None,
        wind_dir: float | None = None,
        comments: str = "",
        igc_s3: str | None = None,
        flightlog_viewer_link: str | None = None,
    ) -> Flight:
        # Validate by instantiating pydantic model
        flight_input = FlightInput(
            date_of_flight=date_of_flight,
            user_id=user_id,
            site_id=site_id,
            glider_id=glider_id,
            start_time=start_time,
            stop_time=stop_time,
            max_altitude=max_altitude,
            wind_speed=wind_speed,
            wind_dir=wind_dir,
            comments=comments,
            igc_s3=igc_s3,
            flightlog_viewer_link=flightlog_viewer_link,
        )

        # Insert into the database
        flight = FlightOrm(**flight_input.model_dump())
        info.context.db_sess.add(flight)
        info.context.db_sess.commit()

        # Convert to graphQL model
        return _sqlalchemy_to_graphql_model(flight, FlightModel, Flight)


@strawberry.type
class Query:
    sites: list[Site] = strawberry.field(resolver=get_sites)
    gliders: list[Glider] = strawberry.field(resolver=get_gliders)
    flights: list[Flight] = strawberry.field(resolver=get_flights)


@strawberry.type
class Mutation:
    @strawberry.field
    def flight(self) -> FlightMutations:
        return FlightMutations()


schema = strawberry.Schema(query=Query, mutation=Mutation)
