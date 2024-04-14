import strawberry
import logbook.webapp.app_globals as app_globals
import logbook.webapp.app_globals as app_globals

from datetime import date
from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from logbook.backend.logbook.lib.data_models import User as DBUser
from logbook.backend.logbook.lib.data_models import Site as DBSite
from logbook.backend.logbook.lib.data_models import Glider as DBGlider
from logbook.backend.logbook.lib.data_models import Flight as DBFlight
from logbook.backend.logbook.lib.domain_models import User as UserModel
from logbook.backend.logbook.lib.domain_models import Site as SiteModel
from logbook.backend.logbook.lib.domain_models import Glider as GliderModel
from logbook.backend.logbook.lib.domain_models import Flight as FlightModel


def get_user_for_flight(root: "Flight"):
    stmt = select(DBUser).where(DBUser.id == root.user_id)
    with Session(app_globals.db_engine) as sess:
        res = sess.execute(stmt).first()
    return User(**UserModel.model_validate(res[0]).model_dump())


def get_site_for_flight(root: "Flight"):
    stmt = select(DBSite).where(DBSite.id == root.site_id)
    with Session(app_globals.db_engine) as sess:
        res = sess.execute(stmt).first()
    return Site(**SiteModel.model_validate(res[0]).model_dump())


def get_glider_for_flight(root: "Flight"):
    stmt = select(DBGlider).where(DBGlider.id == root.glider_id)
    with Session(app_globals.db_engine) as sess:
        res = sess.execute(stmt).first()
    return Glider(**GliderModel.model_validate(res[0]).model_dump())


def get_flights_for_site(root: "Site"):
    stmt = select(DBFlight).where(DBFlight.site_id == root.id)
    with Session(app_globals.db_engine) as sess:
        res = sess.execute(stmt).all()
    return [Flight(**FlightModel.model_validate(s[0]).model_dump()) for s in res]


def get_gliders_for_user(root: "User"):
    stmt = select(DBGlider).where(DBGlider.user_id == root.id)
    with Session(app_globals.db_engine) as sess:
        res = sess.execute(stmt).all()
    return [Glider(**GliderModel.model_validate(s[0]).model_dump()) for s in res]


def get_flights_for_user(root: "User"):
    stmt = select(DBFlight).where(DBFlight.user_id == root.id)
    with Session(app_globals.db_engine) as sess:
        res = sess.execute(stmt).all()
    return [Flight(**FlightModel.model_validate(s[0]).model_dump()) for s in res]


def get_user_for_glider(root: "Glider"):
    stmt = select(DBUser).where(DBUser.id == root.user_id)
    with Session(app_globals.db_engine) as sess:
        res = sess.execute(stmt).first()
    return User(**UserModel.model_validate(res[0]).model_dump())


def get_flights_for_glider(root: "Glider"):
    stmt = select(DBFlight).where(DBFlight.glider_id == root.id)
    with Session(app_globals.db_engine) as sess:
        res = sess.execute(stmt).all()
    return [Flight(**FlightModel.model_validate(s[0]).model_dump()) for s in res]


def get_sites(country: str|None = None):
    stmt = select(DBSite)
    if country:
        stmt = stmt.where(DBSite.country == country)
    with Session(app_globals.db_engine) as sess:
        res = sess.execute(stmt).all()
    return [Site(**SiteModel.model_validate(s[0]).model_dump()) for s in res]


def get_users():
    stmt = select(DBUser)
    with Session(app_globals.db_engine) as sess:
        res = sess.execute(stmt).all()
    return [User(**UserModel.model_validate(s[0]).model_dump()) for s in res]


def get_gliders():
    stmt = select(DBGlider)
    with Session(app_globals.db_engine) as sess:
        res = sess.execute(stmt).all()
    return [Glider(**GliderModel.model_validate(s[0]).model_dump()) for s in res]


def get_flights():
    stmt = select(DBFlight)
    with Session(app_globals.db_engine) as sess:
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
class User:
    id: int
    first_name: str
    last_name: str

    gliders: list["Glider"] = strawberry.field(resolver=get_gliders_for_user)
    flights: list["Flight"] = strawberry.field(resolver=get_flights_for_user)


@strawberry.type
class Glider:
    id: int
    user_id: int
    model: str
    manufacturer: str
    rating: str

    user: User = strawberry.field(resolver=get_user_for_glider)
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
    max_altitude: int|None
    wind_speed: float|None
    wind_dir: float|None
    comments: str
    igc_s3: str|None
    flightlog_viewer_link: str|None

    user: User = strawberry.field(resolver=get_user_for_flight)
    glider: Glider = strawberry.field(resolver=get_glider_for_flight)
    site: Site = strawberry.field(resolver=get_site_for_flight)


@strawberry.type
class Query:
    sites: list[Site] = strawberry.field(resolver=get_sites)
    users: list[User] = strawberry.field(resolver=get_users)
    gliders: list[Glider] = strawberry.field(resolver=get_gliders)
    flights: list[Flight] = strawberry.field(resolver=get_flights)


schema = strawberry.Schema(query=Query)
