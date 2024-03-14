from dataclasses import dataclass
from datetime import datetime
from datetime import time
from typing import TypedDict

from igc_parser.exceptions import InvalidIgcFile
from igc_parser.exceptions import InvalidTrackPointLine
from igc_parser.latlng import haversine


class Position(TypedDict):
    log_time: time
    latitude: float
    longitude: float
    altitude: int


@dataclass
class FlightLog:
    position_logs: list[Position]
    dist_travelled_meters: float
    min_altitude: int
    max_altitude: int

    @property
    def start(self) -> Position:
        return self.position_logs[0]

    @property
    def finish(self) -> Position:
        return self.position_logs


def parse_igc_bytes(igc: bytes) -> FlightLog:
    try:
        igc_str = igc.decode("utf-8")
    except Exception as exc:
        raise InvalidIgcFile("Invalid encoding") from exc
    return parse_igc_str(igc_str)


def parse_igc_str(igc: str) -> FlightLog:
    position_lines = [line for line in igc.splitlines() if line.startswith("B")]

    if len(position_lines) < 3:
        raise InvalidIgcFile("An IGC file must have more than two position logs")

    position_logs = []
    dist_travelled_meters = 0
    max_altitude = None
    min_altitude = None

    for i, line in enumerate(position_lines):
        position = _parse_position_log(line)
        position_logs.append(position)

        if i > 0:
            dist_travelled_meters += haversine(
                position_logs[i - 1]["latitude"],
                position_logs[i - 1]["longitude"],
                position["latitude"],
                position["longitude"],
            )

        if max_altitude is None or position["altitude"] > max_altitude:
            max_altitude = position["altitude"]

        if min_altitude is None or position["altitude"] < min_altitude:
            min_altitude = position["altitude"]

    return FlightLog(
        position_logs=position_logs,
        dist_travelled_meters=dist_travelled_meters,
        max_altitude=max_altitude,
        min_altitude=min_altitude,
    )


def _parse_position_log(line: str) -> Position:
    try:
        timepart = line[1:7]
        latpart = line[7:15]
        lngpart = line[15:24]
        altpart = line[24:35]

        dt = datetime.strptime(timepart, "%H%M%S")
        latitude = round(
            float(latpart[0:2]) + (float(latpart[2:4] + "." + latpart[4:7]) / 60), 7
        )
        longitude = round(
            float(lngpart[0:3]) + (float(lngpart[3:5] + "." + lngpart[5:8]) / 60), 7
        )
        if latpart[-1] == "S":
            latitude *= -1
        if lngpart[-1] == "W":
            longitude *= -1

        return Position(
            log_time=dt.time(),
            latitude=latitude,
            longitude=longitude,
            altitude=int(altpart[6:11]),
        )
    except Exception as exc:
        raise InvalidTrackPointLine() from exc
