from datetime import date
from datetime import datetime

from sqlalchemy.orm import Session

from logbook.lib.data_models import Site
from logbook.lib.data_models import User
from logbook.lib.data_models import Glider
from logbook.lib.data_models import Flight


def insert_testing_data(sess: Session):
    stubai = Site(
        name="Pukerua Bay",
        description="...",
        latitude=-41.030500,
        longitude=174.876000,
        altitude=103,
        country="New Zealand",
    )
    pukerua_bay = Site(
        name="Stubai - Elfer",
        description="...",
        latitude=47.098611,
        longitude=11.324250,
        altitude=1788,
        country="Austria",
    )
    death_star = Site(
        name="Death Star",
        description="...",
        latitude=40.4,
        longitude=40.4,
        altitude=404,
        country="Unknown",
    )
    sess.add_all([stubai, pukerua_bay])

    millar_calder = User(
        email_address="millar9819@gmail.com",
        first_name="Millar",
        last_name="Calder",
        hashed_password="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
    )
    luke_skywalker = User(
        email_address="lukeskywalker@gmail.com",
        first_name="Luke",
        last_name="Skywalker",
        hashed_password="...",
    )
    sess.add_all([millar_calder, luke_skywalker])
    sess.flush()  # send inserts to the DB so we can access generated IDs

    gin_bolero = Glider(
        user=millar_calder, model="Bolero 6", manufacturer="GIN", rating="EN-A"
    )
    millennium_falcon = Glider(
        user=luke_skywalker,
        model="Millennium Falcon",
        manufacturer="Corellian Engineering Corporation",
        rating="Jedi",
    )
    sess.add_all([gin_bolero, millennium_falcon])
    sess.flush()  # send inserts to the DB so we can access generated IDs

    flight_1 = Flight(
        date_of_flight=date(2023, 1, 1),
        user=millar_calder,
        site=pukerua_bay,
        glider=gin_bolero,
        start_time=datetime(2023, 1, 1, 14, 0),
        stop_time=datetime(2023, 1, 1, 15, 0),
        max_altitude=150,
        wind_speed=20,
        wind_dir=155,
        comments="...",
    )
    flight_2 = Flight(
        date_of_flight=date(3033, 1, 1),
        user=luke_skywalker,
        site=death_star,
        glider=millennium_falcon,
        start_time=datetime(3033, 1, 1, 4, 0, 4),
        stop_time=datetime(3033, 1, 1, 4, 0, 4),
        comments="...",
    )
    sess.add_all([flight_1, flight_2])
