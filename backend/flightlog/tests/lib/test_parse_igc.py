import os
from flightlog.lib.parse_igc import extract_path


"""
This is very well tested ;)
"""


def test_extract_path():
    filename = f'{os.path.dirname(os.path.realpath(__file__))}/test_data/220415234416.igc'
    with open(filename, 'r') as file:
        path = extract_path(file.read())

    # B2344163749222S17554358EA0067900752
    # B2344173749221S17554353EA0067800752
    assert path[0] == {
        'sourcePosition': [175.9059667, -37.8203667, 752],
        'targetPosition': [175.9058833, -37.82035, 752]
    }
