import strawberry
from sqlalchemy.orm import Session
from strawberry.fastapi import BaseContext

from logbook.graphql.mutations import Mutation
from logbook.graphql.queries import Query


class CustomContext(BaseContext):
    def __init__(self, user_id: int, db_sess: Session):
        self.user_id = user_id
        self.db_sess = db_sess


schema = strawberry.Schema(query=Query, mutation=Mutation)
