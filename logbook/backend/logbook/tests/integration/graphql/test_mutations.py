from logbook.graphql.schema import schema


def test_add_flight(context):
    mutation = """
        mutation {
            flight {
                add(
                    dateOfFlight: "2024-01-01",
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


def test_add_glider(context):
    mutation = """
        mutation {
            glider {
                add(
                    model: "foo",
                    manufacturer: "bar",
                    rating: "EN-A"
                ) {
                    model
                    manufacturer
                    rating
                }
            }
        }
    """
    result = schema.execute_sync(mutation, context_value=context)
    assert result.errors is None
    assert result.data["glider"]["add"] == {
        "model": "foo",
        "manufacturer": "bar",
        "rating": "EN-A"
    }


def test_add_site(context):
    mutation = """
        mutation {
            site {
                add(
                    name: "foo",
                    description: "...",
                    latitude: 1.99,
                    longitude: -1.99,
                    altitude: 123,
                    country: "bar"
                ) {
                    name
                    latitude
                    longitude
                }
            }
        }
    """
    result = schema.execute_sync(mutation, context_value=context)
    assert result.errors is None
    assert result.data["site"]["add"] == {
        "name": "foo",
        "latitude": 1.99,
        "longitude": -1.99
    }
