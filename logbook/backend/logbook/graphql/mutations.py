from datetime import date, datetime

import strawberry

from logbook.db.models import Flight as FlightOrm, Glider as GliderOrm, Site as SiteOrm
from logbook.graphql import sqlalchemy_to_graphql_model
from logbook.graphql.queries import Flight, Glider, Site
from logbook.models import Flight as FlightModel, Glider as GliderModel, Site as SiteModel
from logbook.models import FlightInput, GliderInput, SiteInput


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
        return sqlalchemy_to_graphql_model(flight, FlightModel, Flight)

@strawberry.type
class GliderMutations:
    @strawberry.mutation
    def add(
        self,
        info: strawberry.Info,
        user_id: int,
        model: str,
        manufacturer: str,
        rating: str
    ) -> Glider:
        # Validate by instantiating pydantic model
        glider_input = GliderInput(
            user_id=user_id,
            model=model,
            manufacturer=manufacturer,
            rating=rating
        )

        # Insert into the database
        glider = GliderOrm(**glider_input.model_dump())
        info.context.db_sess.add(glider)
        info.context.db_sess.commit()

        # Convert to graphQL model
        return sqlalchemy_to_graphql_model(glider, GliderModel, Glider)


@strawberry.type
class SiteMutations:
    @strawberry.mutation
    def add(
        self,
        info: strawberry.Info,
        name: str,
        description: str,
        latitude: float,
        longitude: float,
        altitude: int,
        country: str
    ) -> Site:
        # Validate by instantiating pydantic model
        site_input = SiteInput(
            name=name,
            description=description,
            latitude=latitude,
            longitude=longitude,
            altitude=altitude,
            country=country
        )

        # Insert into the database
        site = SiteOrm(**site_input.model_dump())
        info.context.db_sess.add(site)
        info.context.db_sess.commit()

        # Convert to graphQL model
        return sqlalchemy_to_graphql_model(site, SiteModel, Site)


@strawberry.type
class Mutation:
    @strawberry.field
    def flight(self) -> FlightMutations:
        return FlightMutations()

    @strawberry.field
    def glider(self) -> GliderMutations:
        return GliderMutations()

    @strawberry.field
    def site(self) -> SiteMutations:
        return SiteMutations()
