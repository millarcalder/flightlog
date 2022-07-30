from flightlog.lib.latlng import haversine
from datetime import datetime
from typing import TypedDict


class InvalidIgcFile(Exception):
    ...


class InvalidTrackPointLine(Exception):
    ...


class Position(TypedDict):
    date_time: datetime
    latitude: float
    longitude: float
    altitude: int


class FlightLog:
    position_logs: list[Position]
    start: Position
    finish: Position
    dist_travelled_meters: float
    min_altitude: int
    max_altitude: int

    def __init__(self, igc: str):
        self.position_logs = []
        self.start = None
        self.stop = None
        self.dist_travelled_meters = 0
        self.min_altitude = None
        self.max_altitude = None

        self._parse_igc(igc)
        if len(self.position_logs) < 2:
            raise InvalidIgcFile('An IGC file must have more than two position logs!')

    def _parse_igc(self, igc: str):
        i = 0
        for line in igc.splitlines():
            # Position Log
            if line.startswith('B'):
                position = self._parse_position_log(line)
                self.position_logs.append(position)
                if i > 0: self.dist_travelled_meters += haversine(self.position_logs[i-1]['latitude'], self.position_logs[i-1]['longitude'], position['latitude'], position['longitude'])
                i += 1
                if self.max_altitude is None or position['altitude'] > self.max_altitude: self.max_altitude = position['altitude']
                if self.min_altitude is None or position['altitude'] < self.min_altitude: self.min_altitude = position['altitude']

        self.start = self.position_logs[0]
        self.finish = self.position_logs[-1]

    def _parse_position_log(self, line: str) -> Position:
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
            
            return Position(
                date_time=dt,
                latitude=latitude,
                longitude=longitude,
                altitude=int(altpart[6:11])
            )
        except Exception:
            raise InvalidTrackPointLine()
