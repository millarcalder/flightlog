import contextlib
from datetime import date, datetime

import strawberry
from sqlalchemy import select
from sqlalchemy.orm import Session
from strawberry.fastapi import BaseContext

import logbook.webapp.app_globals as app_globals
from logbook.lib.data_models import Flight as DBFlight
from logbook.lib.data_models import Glider as DBGlider
from logbook.lib.data_models import Site as DBSite
from logbook.lib.domain_models import Flight as FlightModel
from logbook.lib.domain_models import Glider as GliderModel
from logbook.lib.domain_models import Site as SiteModel


class CustomContext(BaseContext):
    def __init__(self, user_id: int):
        self.user_id = user_id

    @classmethod
    @contextlib.contextmanager
    def db_sess(cls):
        sess = Session(app_globals.db_engine)
        yield sess
        sess.close()


def get_site_for_flight(info: strawberry.Info, root: "Flight"):
    stmt = select(DBSite).where(DBSite.id == root.site_id)
    with info.context.db_sess() as sess:
        res = sess.execute(stmt).first()
    return Site(**SiteModel.model_validate(res[0]).model_dump())


def get_glider_for_flight(info: strawberry.Info, root: "Flight"):
    stmt = (
        select(DBGlider)
        .where(DBGlider.id == root.glider_id)
        .where(DBGlider.user_id == info.context.user_id)
    )
    with info.context.db_sess() as sess:
        res = sess.execute(stmt).first()
    return Glider(**GliderModel.model_validate(res[0]).model_dump())


def get_flights_for_site(info: strawberry.Info, root: "Site"):
    stmt = (
        select(DBFlight)
        .where(DBFlight.site_id == root.id)
        .where(DBFlight.user_id == info.context.user_id)
    )
    with info.context.db_sess() as sess:
        res = sess.execute(stmt).all()
    return [Flight(**FlightModel.model_validate(s[0]).model_dump()) for s in res]


def get_flights_for_glider(info: strawberry.Info, root: "Glider"):
    stmt = (
        select(DBFlight)
        .where(DBFlight.glider_id == root.id)
        .where(DBFlight.user_id == info.context.user_id)
    )
    with info.context.db_sess() as sess:
        res = sess.execute(stmt).all()
    return [Flight(**FlightModel.model_validate(s[0]).model_dump()) for s in res]


def get_sites(info: strawberry.Info, country: str | None = None):
    stmt = select(DBSite)
    if country:
        stmt = stmt.where(DBSite.country == country)
    with info.context.db_sess() as sess:
        res = sess.execute(stmt).all()
    return [Site(**SiteModel.model_validate(s[0]).model_dump()) for s in res]


def get_gliders(info: strawberry.Info):
    stmt = select(DBGlider).where(DBGlider.user_id == info.context.user_id)
    with info.context.db_sess() as sess:
        res = sess.execute(stmt).all()
    return [Glider(**GliderModel.model_validate(s[0]).model_dump()) for s in res]


def get_flights(info: strawberry.Info):
    stmt = select(DBFlight).where(DBFlight.user_id == info.context.user_id)
    with info.context.db_sess() as sess:
        res = sess.execute(stmt).all()
    return [Flight(**FlightModel.model_validate(s[0]).model_dump()) for s in res]


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
class Query:
    sites: list[Site] = strawberry.field(resolver=get_sites)
    gliders: list[Glider] = strawberry.field(resolver=get_gliders)
    flights: list[Flight] = strawberry.field(resolver=get_flights)


schema = strawberry.Schema(query=Query)
