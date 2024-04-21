from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from sqlalchemy.orm import Session

import logbook.webapp.app_globals as app_globals
from logbook.lib.auth import (
    Token,
    TokenData,
    authenticate_user,
    fetch_user,
    generate_access_token,
)
from logbook.lib.exceptions import AuthenticationException


class HTTPUnauthenticatedException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
router = APIRouter()


async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(
            token,
            app_globals.settings.password_hash_secret_key,
            algorithms=[app_globals.settings.password_hash_algorithm],
        )
    except JWTError:
        raise HTTPUnauthenticatedException

    try:
        token_data = TokenData(**payload)
    except Exception:
        raise HTTPUnauthenticatedException

    try:
        with Session(app_globals.db_engine) as sess:
            user = fetch_user(email_address=token_data.sub, sess=sess)
    except AuthenticationException:
        raise HTTPUnauthenticatedException

    return user


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
        data=TokenData(sub=user.email_address),
        expires_delta=access_token_expires,
        secret_key=app_globals.settings.password_hash_secret_key,
        algorithm=app_globals.settings.password_hash_algorithm,
    )
    return Token(access_token=token.access_token, token_type=token.token_type)
