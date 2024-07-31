from datetime import date, datetime

import strawberry

from logbook.db.queries import fetch_flights, fetch_gliders, fetch_sites
from logbook.exceptions import NotFoundException
from logbook.graphql import sqlalchemy_to_graphql_model
from logbook.models import Flight as FlightModel
from logbook.models import Glider as GliderModel
from logbook.models import Site as SiteModel


async def get_site_for_flight(info: strawberry.Info, root: "Flight") -> "Site":
    site = await info.context.site_loader.load(root.siteId)
    if site is None:
        raise NotFoundException(f"Site not found, id: {root.siteId}")

    return sqlalchemy_to_graphql_model(site, SiteModel, Site)


async def get_glider_for_flight(info: strawberry.Info, root: "Flight") -> "Glider":
    glider = await info.context.glider_loader.load(root.gliderId)
    if glider is None:
        raise NotFoundException(f"Gider not found, id: {root.gliderId}")

    return sqlalchemy_to_graphql_model(glider, GliderModel, Glider)


async def get_flights_for_site(info: strawberry.Info, root: "Site") -> list["Flight"]:
    flights = await info.context.flights_by_site_and_user_loader.load(
        (info.context.user_id, root.id)
    )
    return [sqlalchemy_to_graphql_model(f, FlightModel, Flight) for f in flights]


def get_flights_for_glider(info: strawberry.Info, root: "Glider") -> list["Flight"]:
    flights = fetch_flights(
        info.context.db_sess,
        filters={"gliderId": root.id, "userId": info.context.user_id},
    )
    return [sqlalchemy_to_graphql_model(f, FlightModel, Flight) for f in flights]


def get_sites(info: strawberry.Info, country: str | None = None) -> list["Site"]:
    filters: dict[str, str | int] = {}
    if country:
        filters["country"] = country
    sites = fetch_sites(info.context.db_sess, filters)
    return [sqlalchemy_to_graphql_model(s, SiteModel, Site) for s in sites]


def get_gliders(info: strawberry.Info) -> list["Glider"]:
    gliders = fetch_gliders(
        info.context.db_sess, filters={"userId": info.context.user_id}
    )
    return [sqlalchemy_to_graphql_model(g, GliderModel, Glider) for g in gliders]


def get_flights(info: strawberry.Info, site_id: int | None = None) -> list["Flight"]:
    filters = {"userId": info.context.user_id}
    if site_id:
        filters["siteId"] = site_id
    flights = fetch_flights(info.context.db_sess, filters=filters)
    return [sqlalchemy_to_graphql_model(f, FlightModel, Flight) for f in flights]


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
    userId: int
    model: str
    manufacturer: str
    rating: str

    flights: list["Flight"] = strawberry.field(resolver=get_flights_for_glider)


@strawberry.type
class Flight:
    id: int
    dateOfFlight: date
    userId: int
    siteId: int
    gliderId: int
    startTime: datetime
    stopTime: datetime
    maxAltitude: int | None
    windSpeed: float | None
    windDir: float | None
    comments: str

    glider: Glider = strawberry.field(resolver=get_glider_for_flight)
    site: Site = strawberry.field(resolver=get_site_for_flight)


@strawberry.type
class Query:
    sites: list[Site] = strawberry.field(resolver=get_sites)
    gliders: list[Glider] = strawberry.field(resolver=get_gliders)
    flights: list[Flight] = strawberry.field(resolver=get_flights)
