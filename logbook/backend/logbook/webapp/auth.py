import logbook.webapp.app_globals as app_globals

from datetime import datetime
from datetime import timedelta
from datetime import timezone

from fastapi import Depends, APIRouter, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import select

from logbook.lib.data_models import User as DBUser
from logbook.lib.domain_models import User


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
router = APIRouter()


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email_address: str | None = None


def _verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def _get_password_hash(password):
    return pwd_context.hash(password)


def _get_user(email_address: str):
    stmt = select(DBUser).where(DBUser.email_address == email_address)
    with Session(app_globals.db_engine) as sess:
        user = sess.execute(stmt).first()
    if not user:
        raise Exception('User not found')
    return User.model_validate(user[0])


def _authenticate_user(email_address: str, password: str):
    user = _get_user(email_address)
    if not user:
        return False
    if not _verify_password(password, user.hashed_password):
        return False
    return user


def _create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode,
        app_globals.settings.password_hash_secret_key,
        algorithm=app_globals.settings.password_hash_algorithm
    )
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token,
            app_globals.settings.password_hash_secret_key,
            algorithms=[app_globals.settings.password_hash_algorithm]
        )
        email_address: str = payload.get("sub")
        if email_address is None:
            raise credentials_exception
        token_data = TokenData(email_address=email_address)
    except JWTError:
        raise credentials_exception
    user = _get_user(email_address=token_data.email_address)
    if user is None:
        raise credentials_exception
    return user


@router.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> Token:
    user = _authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email_address or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=app_globals.settings.access_token_expire_minutes)
    access_token = _create_access_token(
        data={"sub": user.email_address}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")
