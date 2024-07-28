from datetime import date, datetime

from sqlalchemy import Date, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase): ...


class Site(Base):
    __tablename__ = "sites"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String())
    description: Mapped[str] = mapped_column(String())
    latitude: Mapped[float] = mapped_column(Float())
    longitude: Mapped[float] = mapped_column(Float())
    altitude: Mapped[int] = mapped_column(Integer())
    country: Mapped[str] = mapped_column(String())

    flights: Mapped[list["Flight"]] = relationship("Flight", back_populates="site")


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    emailAddress: Mapped[str] = mapped_column(String())
    firstName: Mapped[str] = mapped_column(String())
    lastName: Mapped[str] = mapped_column(String())
    hashedPassword: Mapped[str] = mapped_column(String())

    gliders: Mapped[list["Glider"]] = relationship("Glider", back_populates="user")
    flights: Mapped[list["Flight"]] = relationship("Flight", back_populates="user")


class Glider(Base):
    __tablename__ = "gliders"

    id: Mapped[int] = mapped_column(primary_key=True)
    userId = mapped_column(ForeignKey("users.id"))
    model: Mapped[str] = mapped_column(String())
    manufacturer: Mapped[str] = mapped_column(String())
    rating: Mapped[str] = mapped_column(String())

    user: Mapped["User"] = relationship("User", back_populates="gliders")
    flights: Mapped[list["Flight"]] = relationship("Flight", back_populates="glider")


class Flight(Base):
    __tablename__ = "flights"

    id: Mapped[int] = mapped_column(primary_key=True)
    dateOfFlight: Mapped[date] = mapped_column(Date())
    userId: Mapped[int] = mapped_column(ForeignKey("users.id"))
    siteId: Mapped[int] = mapped_column(ForeignKey("sites.id"))
    gliderId: Mapped[int] = mapped_column(ForeignKey("gliders.id"))
    startTime: Mapped[datetime] = mapped_column(DateTime())
    stopTime: Mapped[datetime] = mapped_column(DateTime())
    maxAltitude: Mapped[int | None] = mapped_column(Integer())
    windSpeed: Mapped[float | None] = mapped_column(Float())
    windDir: Mapped[float | None] = mapped_column(Float())
    comments: Mapped[str] = mapped_column(String())

    user: Mapped["User"] = relationship("User", back_populates="flights")
    glider: Mapped[list["Glider"]] = relationship("Glider", back_populates="flights")
    site: Mapped["Site"] = relationship("Site", back_populates="flights")
