from datetime import datetime, timedelta, timezone

from jose import jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from logbook.db.models import User as DBUser
from logbook.exceptions import AuthenticationException
from logbook.models import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    sub: str


def _verify_password(plain_password, hashed_password) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def _generate_password_hash(password) -> str:
    return pwd_context.hash(password)


def fetch_user(email_address: str, sess: Session) -> User:
    user = sess.execute(
        select(DBUser).where(DBUser.emailAddress == email_address)
    ).first()
    if not user:
        raise AuthenticationException("User not found")
    return User.model_validate(user[0])


def authenticate_user(email_address: str, password: str, sess: Session) -> User:
    user = fetch_user(email_address, sess)
    if not _verify_password(password, user.hashedPassword):
        raise AuthenticationException("Incorrect password")
    return user


def generate_access_token(
    data: TokenData, expires_delta: timedelta, secret_key: str, algorithm: str
) -> Token:
    to_encode = data.model_dump()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    access_token = jwt.encode(to_encode, secret_key, algorithm)
    return Token(access_token=access_token, token_type="bearer")
