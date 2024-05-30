from typing import Type, TypeVar

import strawberry
from pydantic import BaseModel

from logbook.db.models import Base


Model = TypeVar("Model", bound=BaseModel)


def sqlalchemy_to_graphql_model(
    obj: Base, pydantic_model: Type[Model], graphql_model: strawberry.type
) -> Model:
    return graphql_model(**pydantic_model.model_validate(obj).model_dump())
