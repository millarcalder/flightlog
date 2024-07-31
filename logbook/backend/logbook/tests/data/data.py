import logging
import random
from datetime import date, datetime, timedelta

from faker import Faker
from sqlalchemy.orm import Session

from logbook.db.models import Flight, Glider, Site, User

_logger = logging.getLogger()


def insert_testing_data(sess: Session):
    # Insert Users
    chewbacca = User(
        emailAddress="chewie@gmail.com",
        firstName="Chewbacca",
        lastName="AKA Chewie",
        # password: enter
        hashedPassword="$2b$12$kHvtKLe4vLfLbKqaW4mltee7MZdaCwSV9Qbr2zp9B4JZsu8DS9kqO",
    )
    luke_skywalker = User(
        emailAddress="lukeskywalker@gmail.com",
        firstName="Luke",
        lastName="Skywalker",
        # password: 123qwe
        hashedPassword="$2b$12$kygd6KDhdd3gsDA4uOhGTuh7U5H3qUaK5Igf7u7XvmddeXXpNjOhO",
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


def generate_fake_testing_data(sess: Session):
    NUM_USERS = 500
    NUM_SITES = 2500
    RANGE_GLIDERS_PER_USER = 5
    RANGE_SITES_FLOWN_PER_USER = 100
    RANGE_FLIGHTS_PER_USER_PER_SITE = 100
    POSSIBLE_GLIDERS = [
        ("GIN", "Bolero 6", "EN-A"),
        ("GIN", "Bolero 7", "EN-A"),
        ("GIN", "Yeti 6", "EN-A"),
        ("GIN", "Evora", "EN-B"),
        ("GIN", "Calypso 2", "EN-B"),
        ("GIN", "Bonanza 3", "EN-C"),
    ]

    fake = Faker()

    _logger.info(f"Generating {NUM_USERS} users...")
    users: list[User] = [
        # We should have one known user
        User(
            emailAddress="chewie@gmail.com",
            firstName="Chewbacca",
            lastName="AKA Chewie",
            # password: enter
            hashedPassword="$2b$12$kHvtKLe4vLfLbKqaW4mltee7MZdaCwSV9Qbr2zp9B4JZsu8DS9kqO",
        )
    ]
    for _ in range(NUM_USERS):
        first_name = fake.first_name()
        last_name = fake.last_name()
        users.append(
            User(
                emailAddress=f"{first_name}{last_name}@foo.bar",
                firstName=first_name,
                lastName=last_name,
                # password: enter
                hashedPassword="$2b$12$kHvtKLe4vLfLbKqaW4mltee7MZdaCwSV9Qbr2zp9B4JZsu8DS9kqO",
            )
        )
    _logger.info(f"Finished generating {NUM_USERS} users")

    _logger.info(f"Generating {NUM_SITES} sites...")
    sites = []
    for _ in range(NUM_SITES):
        # TODO: location_on_land doesn't provide an altitude so I'm using a random int for now
        place = fake.location_on_land()
        sites.append(
            Site(
                name=place[2],
                description="...",
                latitude=float(place[0]),
                longitude=float(place[1]),
                altitude=fake.random_int(min=0, max=2000),
                country=place[4],
            )
        )
    _logger.info(f"Finished generating {NUM_SITES} sites")

    sess.add_all(users)
    sess.add_all(sites)
    sess.flush()

    _logger.info(
        f"Generating between 1 and {RANGE_GLIDERS_PER_USER} gliders for each user..."
    )
    gliders = []
    for user in users:
        _logger.info(f"Generating gliders for user ID {user.id}...")
        for _ in range(random.randint(1, RANGE_GLIDERS_PER_USER)):
            user_glider = random.choice(POSSIBLE_GLIDERS)
            gliders.append(
                Glider(
                    user=user,
                    model=user_glider[0],
                    manufacturer=user_glider[1],
                    rating=user_glider[2],
                )
            )
    _logger.info(f"Finished generating {len(gliders)} gliders...")

    sess.add_all(gliders)
    sess.flush()

    _logger.info("Generating flights for each user...")
    for user in users:
        flights = []
        _logger.info(f"Generating flights for user ID {user.id}...")
        for site in random.choices(sites, k=RANGE_SITES_FLOWN_PER_USER):
            for _ in range(random.randint(1, RANGE_FLIGHTS_PER_USER_PER_SITE)):
                start_date = fake.date_between(date(2000, 1, 1), date(2024, 1, 1))
                start_time = fake.date_time_between(
                    datetime(2024, 1, 1, 8, 0, 0), datetime(2024, 1, 1, 17, 0, 0)
                )
                stop_time = fake.date_time_between(
                    start_time + timedelta(minutes=5), datetime(2024, 1, 1, 17, 0, 0)
                )

                flight_glider: Glider = random.choice(user.gliders)
                flights.append(
                    Flight(
                        dateOfFlight=start_date,
                        user=user,
                        site=site,
                        glider=flight_glider,
                        startTime=datetime(
                            start_date.year,
                            start_date.month,
                            start_date.day,
                            start_time.hour,
                            start_time.minute,
                            start_time.second,
                        ),
                        stopTime=datetime(
                            start_date.year,
                            start_date.month,
                            start_date.day,
                            stop_time.hour,
                            stop_time.minute,
                            stop_time.second,
                        ),
                        comments=fake.sentence(nb_words=10),
                    )
                )
        sess.add_all(flights)
    _logger.info(f"Finished generating {len(flights)} flights...")

    sess.commit()
