from datetime import date
from datetime import datetime
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy import ForeignKey
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship
from sqlalchemy import String
from sqlalchemy import Float
from sqlalchemy import Integer
from sqlalchemy import Date
from sqlalchemy import DateTime


class Base(DeclarativeBase):
    ...


class Site(Base):
    __tablename__ = 'sites'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String())
    description: Mapped[str] = mapped_column(String())
    latitude: Mapped[float] = mapped_column(Float())
    longitude: Mapped[float] = mapped_column(Float())
    altitude: Mapped[int] = mapped_column(Integer())
    country: Mapped[str] = mapped_column(String())

    flights: Mapped[list["Flight"]] = relationship("Flight", back_populates="site")


class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(primary_key=True)
    email_address: Mapped[str] = mapped_column(String())
    first_name: Mapped[str] = mapped_column(String())
    last_name: Mapped[str] = mapped_column(String())
    hashed_password: Mapped[str] = mapped_column(String())

    gliders: Mapped[list["Glider"]] = relationship("Glider", back_populates="user")
    flights: Mapped[list["Flight"]] = relationship("Flight", back_populates="user")


class Glider(Base):
    __tablename__ = 'gliders'

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id = mapped_column(ForeignKey("users.id"))
    model: Mapped[str] = mapped_column(String())
    manufacturer: Mapped[str] = mapped_column(String())
    rating: Mapped[str] = mapped_column(String())

    user: Mapped["User"] = relationship("User", back_populates="gliders")
    flights: Mapped[list["Flight"]] = relationship("Flight", back_populates="glider")


class Flight(Base):
    __tablename__ = 'flights'

    id: Mapped[int] = mapped_column(primary_key=True)
    date_of_flight: Mapped[date] = mapped_column(Date())
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    site_id: Mapped[int] = mapped_column(ForeignKey("sites.id"))
    glider_id: Mapped[int] = mapped_column(ForeignKey("gliders.id"))
    start_time: Mapped[datetime] = mapped_column(DateTime())
    stop_time: Mapped[datetime] = mapped_column(DateTime())
    max_altitude: Mapped[int|None] = mapped_column(Integer())
    wind_speed: Mapped[float|None] = mapped_column(Float())
    wind_dir: Mapped[float|None] = mapped_column(Float())
    comments: Mapped[str] = mapped_column(String())
    igc_s3: Mapped[str|None] = mapped_column(String())
    flightlog_viewer_link: Mapped[str|None] = mapped_column(String())

    user: Mapped["User"] = relationship("User", back_populates="flights")
    glider: Mapped[list["Glider"]] = relationship("Glider", back_populates="flights")
    site: Mapped["Site"] = relationship("Site", back_populates="flights")
