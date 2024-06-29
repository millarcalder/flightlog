from typing import Type, TypeVar

from pydantic import BaseModel

from logbook.db.models import Base

PydanticModel = TypeVar("PydanticModel", bound=BaseModel)
GraphQLModel = TypeVar("GraphQLModel")


def sqlalchemy_to_graphql_model(
    obj: Base, pydantic_model: Type[PydanticModel], graphql_model: Type[GraphQLModel]
) -> GraphQLModel:
    return graphql_model(**pydantic_model.model_validate(obj).model_dump())
