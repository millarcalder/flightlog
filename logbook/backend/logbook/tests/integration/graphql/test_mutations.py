from logbook.graphql.schema import schema


def test_add_flight(context):
    mutation = """
        mutation {
            flight {
                add(
                    dateOfFlight: "2024-01-01",
                    userId: 1,
                    siteId: 1,
                    gliderId:1,
                    startTime: "2024-01-01 12:00:00",
                    stopTime: "2024-01-01 13:00:00",
                    maxAltitude: 10,
                    windSpeed: null,
                    windDir: null,
                    comments: "foo",
                    igcS3: null,
                    flightlogViewerLink: null
                ) {
                    dateOfFlight
                    site {
                        name
                    }
                }
            }
        }
    """
    result = schema.execute_sync(mutation, context_value=context)
    assert result.errors is None
    assert result.data["flight"]["add"] == {
        "dateOfFlight": "2024-01-01",
        "site": {"name": "Stubai - Elfer"},
    }


def test_add_flight__invalid_date(context):
    mutation = """
        mutation {
            flight {
                add(
                    dateOfFlight: "foo",
                    userId: 1,
                    siteId: 1,
                    gliderId:1,
                    startTime: "2024-01-01 12:00:00",
                    stopTime: "2024-01-01 13:00:00",
                    maxAltitude: 10,
                    windSpeed: null,
                    windDir: null,
                    comments: "foo",
                    igcS3: null,
                    flightlogViewerLink: null
                ) {
                    dateOfFlight
                    site {
                        name
                    }
                }
            }
        }
    """
    result = schema.execute_sync(mutation, context_value=context)

    assert len(result.errors) == 1
    assert (
        result.errors[0].message
        == "Value cannot represent a Date: \"foo\". Invalid isoformat string: 'foo'"
    )


def test_add_flight__invalid_altitude(context):
    mutation = """
        mutation {
            flight {
                add(
                    dateOfFlight: "2024-01-01",
                    userId: 1,
                    siteId: 1,
                    gliderId:1,
                    startTime: "2024-01-01 12:00:00",
                    stopTime: "2024-01-01 13:00:00",
                    maxAltitude: -10,
                    windSpeed: null,
                    windDir: null,
                    comments: "foo",
                    igcS3: null,
                    flightlogViewerLink: null
                ) {
                    dateOfFlight
                    site {
                        name
                    }
                }
            }
        }
    """
    result = schema.execute_sync(mutation, context_value=context)

    assert len(result.errors) == 1
    assert "Assertion failed, -10 is not a valid altitude" in result.errors[0].message
