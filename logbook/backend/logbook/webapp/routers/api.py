from fastapi import APIRouter, Depends, File, HTTPException
from sqlalchemy.orm import Session

import logbook.webapp.app_globals as app_globals
from logbook.db.models import Flight as FlightOrm
from logbook.db.models import Glider as GliderOrm
from logbook.db.models import Site as SiteOrm
from logbook.db.queries import fetch_flight_by_filters, fetch_glider
from logbook.models import (
    Flight,
    FlightInput,
    Glider,
    GliderInput,
    Site,
    SiteInput,
    User,
)
from logbook.webapp.dependencies import get_current_user, get_db_sess, get_s3_resource

router = APIRouter(prefix="/api")


@router.post("/flight")
def add_flight(
    input: FlightInput,
    current_user: User = Depends(get_current_user),
    db_sess: Session = Depends(get_db_sess),
) -> Flight:
    db_sess.begin()
    try:
        # Make sure to also return the linked glider model like the UI expects
        glider_orm = fetch_glider(db_sess, input.gliderId)
        flight_orm = FlightOrm(**input.model_dump(), userId=current_user.id)

        db_sess.add(flight_orm)
        db_sess.flush()

        glider = Glider.model_validate(glider_orm)
        flight = Flight.model_validate(flight_orm)
        flight.glider = glider

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
) -> Glider:
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
) -> Site:
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


@router.put("/flight/{flight_id}/upload-igc")
def attach_igc_to_flight(
    flight_id: int,
    igc: bytes = File(),
    current_user: User = Depends(get_current_user),
    db_sess: Session = Depends(get_db_sess),
    s3_resource=Depends(get_s3_resource),
):
    flight_orm = fetch_flight_by_filters(
        db_sess, {"id": flight_id, "userId": current_user.id}
    )
    if flight_orm is None:
        raise HTTPException(404)

    obj = s3_resource.Object(app_globals.settings.igc_files_bucket, f"{flight_id}")
    obj.put(Body=igc, ContentType="binary/octet-stream")
