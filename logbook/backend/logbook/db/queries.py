from typing import Type, TypeVar, Tuple, Sequence

from sqlalchemy import Select, select
from sqlalchemy.orm import Session

from logbook.db.models import Base, Flight, Glider, Site
from logbook.exceptions import LogbookException


Model = TypeVar("Model", bound=Base)
Filters = dict[str, str | int]


class InvalidFilter(LogbookException):
    def __init__(self, orm_model: Type[Model], filter: str) -> None:
        super().__init__(
            f"The table {orm_model.__tablename__} does not contain the column {filter}"
        )


def _build_stmt(model: Type[Model], filters: Filters = {}) -> Select[Tuple[Model]]:
    stmt = select(model)
    for k, v in filters.items():
        try:
            stmt = stmt.where(getattr(model, k) == v)
        except AttributeError as exc:
            raise InvalidFilter(model, k) from exc
    return stmt


def fetch_sites(sess: Session, filters: Filters = {}) -> Sequence[Site]:
    stmt = _build_stmt(Site, filters)
    return sess.execute(stmt).scalars().all()


def fetch_site(sess: Session, id: int) -> Site | None:
    stmt = _build_stmt(Site, {"id": id})
    return sess.execute(stmt).scalar()


def fetch_site_by_filters(sess: Session, filters: Filters = {}) -> Site | None:
    stmt = _build_stmt(Site, filters)
    return sess.execute(stmt).scalar()


def fetch_flights(sess: Session, filters: Filters = {}) -> Sequence[Flight]:
    stmt = _build_stmt(Flight, filters)
    return sess.execute(stmt).scalars().all()


def fetch_flight(sess: Session, id: int) -> Flight | None:
    stmt = _build_stmt(Flight, {"id": id})
    return sess.execute(stmt).scalar()


def fetch_flight_by_filters(sess: Session, filters: Filters = {}) -> Flight | None:
    stmt = _build_stmt(Flight, filters)
    return sess.execute(stmt).scalar()


def fetch_gliders(sess: Session, filters: Filters = {}) -> Sequence[Glider]:
    stmt = _build_stmt(Glider, filters)
    return sess.execute(stmt).scalars().all()


def fetch_glider(sess: Session, id: int) -> Glider | None:
    stmt = _build_stmt(Glider, {"id": id})
    return sess.execute(stmt).scalar()


def fetch_glider_by_filters(sess: Session, filters: Filters = {}) -> Glider | None:
    stmt = _build_stmt(Glider, filters)
    return sess.execute(stmt).scalar()
