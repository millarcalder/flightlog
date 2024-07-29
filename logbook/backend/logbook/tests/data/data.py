from datetime import date, datetime

from sqlalchemy.orm import Session

from logbook.db.models import Flight, Glider, Site, User


def insert_testing_data(sess: Session):
    # Insert Users
    chewbacca = User(
        emailAddress="chewie@gmail.com",
        firstName="Chewbacca",
        lastName="AKA Chewie",
        hashedPassword="$2b$12$kHvtKLe4vLfLbKqaW4mltee7MZdaCwSV9Qbr2zp9B4JZsu8DS9kqO",  # enter
    )
    luke_skywalker = User(
        emailAddress="lukeskywalker@gmail.com",
        firstName="Luke",
        lastName="Skywalker",
        hashedPassword="$2b$12$kygd6KDhdd3gsDA4uOhGTuh7U5H3qUaK5Igf7u7XvmddeXXpNjOhO",  # 123qwe
    )
    sess.add_all([chewbacca, luke_skywalker])
    sess.flush()  # send inserts to the DB so we can access generated IDs

    # Insert Sites
    pukerua_bay = Site(
        name="Pukerua Bay",
        description="...",
        latitude=-41.030500,
        longitude=174.876000,
        altitude=103,
        country="New Zealand",
    )
    stubai = Site(
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
    sess.flush()  # send inserts to the DB so we can access generated IDs

    # Insert Gliders
    gin_bolero = Glider(
        user=chewbacca, model="Bolero 6", manufacturer="GIN", rating="EN-A"
    )
    millennium_falcon = Glider(
        user=luke_skywalker,
        model="Millennium Falcon",
        manufacturer="Corellian Engineering Corporation",
        rating="Jedi",
    )
    sess.add_all([gin_bolero, millennium_falcon])
    sess.flush()  # send inserts to the DB so we can access generated IDs

    # Insert Flights
    flight_1 = Flight(
        dateOfFlight=date(2023, 1, 1),
        user=chewbacca,
        site=pukerua_bay,
        glider=gin_bolero,
        startTime=datetime(2023, 1, 1, 14, 0),
        stopTime=datetime(2023, 1, 1, 15, 0),
        maxAltitude=150,
        windSpeed=20,
        windDir=155,
        comments="...",
    )
    flight_2 = Flight(
        dateOfFlight=date(3033, 1, 1),
        user=luke_skywalker,
        site=death_star,
        glider=millennium_falcon,
        startTime=datetime(3033, 1, 1, 4, 0, 4),
        stopTime=datetime(3033, 1, 1, 4, 0, 4),
        comments="...",
    )
    sess.add_all([flight_1, flight_2])
    sess.flush()  # send inserts to the DB so we can access generated IDs
