class IgcParserException(Exception):
    ...


class InvalidIgcFile(IgcParserException):
    ...


class InvalidTrackPointLine(InvalidIgcFile):
    ...
