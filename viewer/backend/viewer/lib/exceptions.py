class ViewerException(Exception):
    ...


class InvalidFlightLogName(ViewerException):
    def __init__(self, name: str, *args):
        super().__init__(*args)
        self.name = name


class FlightLogNameAlreadyTaken(ViewerException):
    def __init__(self, name: str, *args):
        super().__init__(*args)
        self.name = name


class IgcFileNotFound(ViewerException):
    def __init__(self, name: str, *args):
        super().__init__(*args)
        self.name = name


class IgcFileTooLarge(ViewerException):
    def __init__(self, size_bytes: int, *args: object) -> None:
        super().__init__(*args)
        self.size_bytes = size_bytes
