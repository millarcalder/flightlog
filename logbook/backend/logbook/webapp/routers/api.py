from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from logbook.db.models import Flight as FlightOrm
from logbook.db.models import Glider as GliderOrm
from logbook.db.models import Site as SiteOrm
from logbook.models import (
    Flight,
    FlightInput,
    Glider,
    GliderInput,
    Site,
    SiteInput,
    User,
)
from logbook.webapp.dependencies import get_current_user, get_db_sess

router = APIRouter(prefix="/api")


@router.post("/flight")
def add_flight(
    input: FlightInput,
    current_user: User = Depends(get_current_user),
    db_sess: Session = Depends(get_db_sess),
):
    db_sess.begin()
    try:
        flight_orm = FlightOrm(**input.model_dump(), userId=current_user.id)
        db_sess.add(flight_orm)
        db_sess.flush()
        flight = Flight.model_validate(flight_orm)
        db_sess.commit()
        return flight
    except Exception as exc:
        db_sess.rollback()
        raise exc


@router.post("/glider")
def add_glider(
    input: GliderInput,
    current_user: User = Depends(get_current_user),
    db_sess: Session = Depends(get_db_sess),
):
    db_sess.begin()
    try:
        glider_orm = GliderOrm(**input.model_dump(), userId=current_user.id)
        db_sess.add(glider_orm)
        db_sess.flush()
        glider = Glider.model_validate(glider_orm)
        db_sess.commit()
        return glider
    except Exception as exc:
        db_sess.rollback()
        raise exc


@router.post("/site")
def add_site(
    input: SiteInput,
    current_user: User = Depends(get_current_user),
    db_sess: Session = Depends(get_db_sess),
):
    db_sess.begin()
    try:
        site_orm = SiteOrm(**input.model_dump())
        db_sess.add(site_orm)
        db_sess.flush()
        site = Site.model_validate(site_orm)
        db_sess.commit()
        return site
    except Exception as exc:
        db_sess.rollback()
        raise exc
