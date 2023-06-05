class FlightLogException(Exception):
    ...


class InvalidFlightLogName(FlightLogException):
    def __init__(self, name: str, *args):
        super().__init__(*args)
        self.name = name


class FlightLogNameAlreadyTaken(FlightLogException):
    def __init__(self, name: str, *args):
        super().__init__(*args)
        self.name = name


class IgcFileNotFound(FlightLogException):
    def __init__(self, name: str, *args):
        super().__init__(*args)
        self.name = name


class InvalidIgcFile(FlightLogException):
    ...


class InvalidTrackPointLine(InvalidIgcFile):
    ...


class IgcFileTooLarge(InvalidIgcFile):
    def __init__(self, size_bytes: int, *args: object) -> None:
        super().__init__(*args)
        self.size_bytes = size_bytes
