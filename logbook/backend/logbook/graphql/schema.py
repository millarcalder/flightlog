import strawberry
from sqlalchemy.orm import Session
from strawberry.dataloader import DataLoader
from strawberry.fastapi import BaseContext

from logbook.graphql.data_loaders import (
    FlightsBySiteAndUserLoader,
    GliderLoader,
    SiteLoader,
)
from logbook.graphql.queries import Query


class CustomContext(BaseContext):
    def __init__(self, user_id: int, db_sess: Session):
        self.user_id = user_id
        self.db_sess = db_sess
        self.glider_loader = DataLoader(load_fn=GliderLoader(db_sess))
        self.site_loader = DataLoader(load_fn=SiteLoader(db_sess))
        self.flights_by_site_and_user_loader = DataLoader(
            load_fn=FlightsBySiteAndUserLoader(db_sess)
        )


schema = strawberry.Schema(query=Query)
