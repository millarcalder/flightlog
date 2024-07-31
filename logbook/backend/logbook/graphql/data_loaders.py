from sqlalchemy.orm import Session

from logbook.db.models import Flight, Glider, Site
from logbook.db.queries import (
    fetch_flights_by_user_id_and_site_ids,
    fetch_glider,
    fetch_site,
)


class GliderLoader:
    def __init__(self, db_sess: Session):
        self.db_sess = db_sess

    async def __call__(self, keys: list[int]) -> list[Glider | None]:
        return [fetch_glider(self.db_sess, key) for key in keys]


class SiteLoader:
    def __init__(self, db_sess: Session):
        self.db_sess = db_sess

    async def __call__(self, keys: list[int]) -> list[Site | None]:
        return [fetch_site(self.db_sess, key) for key in keys]


class FlightsBySiteAndUserLoader:
    def __init__(self, db_sess: Session):
        self.db_sess = db_sess

    async def __call__(self, keys: list[tuple[int, int]]) -> list[list[Flight]]:
        """
        Makes a database query per user ID for the flights at each site requested for the user.
        This reduces the number of queries made to the database for large queries such as fetching
        all sites and loading all related flights.

        key: (user_id, site_id)
        """

        # Build a dictionary of user ID to site IDs
        user_site_ids: dict[int, list[int]] = {}
        for key in keys:
            user_id = key[0]
            site_id = key[1]
            if user_id not in user_site_ids:
                user_site_ids[user_id] = []
            user_site_ids[user_id].append(site_id)

        # Initialize a dictionary of key to list of flights
        data: dict[tuple[int, int], list[Flight]] = {key: [] for key in keys}

        # Make a database query per user for relevant flights
        for user_id, site_ids in user_site_ids.items():
            flights = fetch_flights_by_user_id_and_site_ids(
                self.db_sess, user_id, site_ids
            )

            # Add flights into the dictionary
            for flight in flights:
                data[(user_id, flight.siteId)].append(flight)

        # Return flights in order of the input keys
        return [data[k] for k in keys]
