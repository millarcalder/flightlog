import boto3
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

import logbook.webapp.app_globals as app_globals
from logbook.auth import TokenData, fetch_user
from logbook.exceptions import AuthenticationException
from logbook.webapp.exceptions import HTTPUnauthenticatedException

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


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


def get_db_sess():
    sess = Session(app_globals.db_engine)
    try:
        yield sess
    finally:
        sess.close()


def get_s3_resource():
    return boto3.resource(
        "s3",
        endpoint_url=app_globals.settings.s3_endpoint_url,
        aws_access_key_id=app_globals.settings.aws_access_key_id,
        aws_secret_access_key=app_globals.settings.aws_secret_access_key,
    )
