import strawberry

from datetime import date, datetime

from logbook.db.models import Flight as FlightOrm
from logbook.graphql import sqlalchemy_to_graphql_model
from logbook.graphql.queries import Flight
from logbook.models import FlightInput as FlightInput
from logbook.models import Flight as FlightModel


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
class Mutation:
    @strawberry.field
    def flight(self) -> FlightMutations:
        return FlightMutations()
