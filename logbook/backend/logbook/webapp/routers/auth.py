from datetime import timedelta

from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

import logbook.webapp.app_globals as app_globals
from logbook.webapp.exceptions import HTTPUnauthenticatedException
from logbook.auth import (
    Token,
    TokenData,
    authenticate_user,
    generate_access_token,
)
from logbook.exceptions import AuthenticationException


router = APIRouter()


@router.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> Token:
    try:
        with Session(app_globals.db_engine) as sess:
            user = authenticate_user(form_data.username, form_data.password, sess)
    except AuthenticationException:
        raise HTTPUnauthenticatedException

    access_token_expires = timedelta(
        minutes=app_globals.settings.access_token_expire_minutes
    )
    token = generate_access_token(
        data=TokenData(sub=user.emailAddress),
        expires_delta=access_token_expires,
        secret_key=app_globals.settings.password_hash_secret_key,
        algorithm=app_globals.settings.password_hash_algorithm,
    )
    return Token(access_token=token.access_token, token_type=token.token_type)
