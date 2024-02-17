import os
import pytest
from datetime import time
from pathlib import Path
from igc_parser.exceptions import InvalidIgcFile
from igc_parser.exceptions import InvalidTrackPointLine
from igc_parser import parse_igc_bytes
from igc_parser import parse_igc_str


test_file_path = (
    f"{Path(os.path.dirname(os.path.realpath(__file__))).parents[3]}/data/220415234416.igc"
)


def test_parse_igc_str__valid():
    with open(test_file_path, "r") as file:
        flight = parse_igc_str(file.read())

    # B2344163749222S17554358EA0067900752
    # B2344173749221S17554353EA0067800752
    flight.position_logs[0] == {
        "log_time": time(23, 44, 16),
        "latitude": 175.9059667,
        "longitude": -37.8203667,
        "altitude": 752,
    }
    flight.position_logs[1] == {
        "log_time": time(23, 44, 17),
        "latitude": 175.9058833,
        "longitude": -37.82035,
        "altitude": 752,
    }


def test_parse_igc_bytes__valid():
    with open(test_file_path, "rb") as file:
        flight = parse_igc_bytes(file.read())

    # B2344163749222S17554358EA0067900752
    # B2344173749221S17554353EA0067800752
    flight.position_logs[0] == {
        "log_time": time(23, 44, 16),
        "latitude": 175.9059667,
        "longitude": -37.8203667,
        "altitude": 752,
    }
    flight.position_logs[1] == {
        "log_time": time(23, 44, 17),
        "latitude": 175.9058833,
        "longitude": -37.82035,
        "altitude": 752,
    }


def test_parse_igc_str__too_short():
    with pytest.raises(InvalidIgcFile):
        parse_igc_str(
            "B2344163749222S17554358EA0067900752\nB2344173749221S17554353EA0067800752\nA2344173749221S17554353EA0067800752\nA2344173749221S17554353EA0067800752"
        )


def test_parse_igc_str__invalid_line():
    with pytest.raises(InvalidTrackPointLine):
        parse_igc_str(
            "B234416374helloworld9222S17554358EA0067900752\nB2344173749221S17554353EA0067800752\nB2344183749221S17554353EA0067800752"
        )

    with pytest.raises(InvalidTrackPointLine):
        parse_igc_str(
            "B234416374\nB2344173749221S17554353EA0067800752\nB2344183749221S17554353EA0067800752"
        )
