from datetime import datetime
from typing import TypedDict


class InvalidTrackPointLine(Exception):
    ...


class TrackPoint(TypedDict):
    date_time: datetime
    latitude: float
    longitude: float
    altitude: int


def _parse_line(line: str) -> TrackPoint:
    try:
        timepart = line[1:7]
        latpart = line[7:15]
        lngpart = line[15:24]
        altpart = line[24:35]

        dt = datetime.strptime(timepart, '%H%M%S')
        latitude = round(float(latpart[0:2]) + (float(latpart[2:4] + '.' + latpart[4:7]) / 60), 7)
        longitude = round(float(lngpart[0:3]) + (float(lngpart[3:5] + '.' + lngpart[5:8]) / 60), 7)
        if latpart[-1] == 'S':
            latitude *= -1
        if lngpart[-1] == 'W':
            longitude *= -1
        
        return TrackPoint(
            date_time=dt,
            latitude=latitude,
            longitude=longitude,
            altitude=int(altpart[6:11])
        )
    except Exception:
        raise InvalidTrackPointLine()


def extract_path(igc: str):
    path = []
    prev = None
    for line in igc.splitlines():
        if line.startswith('B'):
            trackpoint = _parse_line(line)
            pos = [trackpoint['longitude'], trackpoint['latitude'], trackpoint['altitude']]
            if prev:
                path.append({'sourcePosition': prev, 'targetPosition': pos})
            prev = pos

    return path
