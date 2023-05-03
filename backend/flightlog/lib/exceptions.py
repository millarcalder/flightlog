class InvalidFlightLogName(Exception):
    def __init__(self, name: str, *args):
        super().__init__(*args)
        self.name = name


class FlightLogNameAlreadyTaken(Exception):
    def __init__(self, name: str, *args):
        super().__init__(*args)
        self.name = name


class IgcFileNotFound(Exception):
    def __init__(self, name: str, *args):
        super().__init__(*args)
        self.name = name


class InvalidIgcFile(Exception):
    ...


class InvalidTrackPointLine(Exception):
    ...
