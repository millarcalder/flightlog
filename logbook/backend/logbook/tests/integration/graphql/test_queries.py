import pytest

from logbook.graphql.schema import schema


@pytest.mark.parametrize(
    ("country", "site_names"),
    (
        (None, ["Death Star", "Stubai - Elfer", "Pukerua Bay"]),
        ("Austria", ["Stubai - Elfer"]),
    ),
)
def test_sites(context, country, site_names):
    query = """
        query TestQuery($country: String) {
            sites(country: $country) {
                name
            }
        }
    """
    result = schema.execute_sync(
        query, variable_values={"country": country}, context_value=context
    )
    assert "sites" in result.data
    for site_name in site_names:
        assert {"name": site_name} in result.data["sites"]


def test_sites__relations(context):
    query = """
        query {
            sites {
                name
                flights {
                    dateOfFlight
                }
            }
        }
    """
    result = schema.execute_sync(query, context_value=context)
    assert "sites" in result.data
    assert {"name": "Stubai - Elfer", "flights": [{"dateOfFlight": "2023-01-01"}]}


def test_gliders(context):
    query = """
    query {
        gliders {
            manufacturer
            model
        }
    }
    """
    result = schema.execute_sync(query, context_value=context)
    assert "gliders" in result.data
    assert result.data["gliders"] == [{"manufacturer": "GIN", "model": "Bolero 6"}]


def test_gliders__relations(context):
    query = """
    query {
        gliders {
            manufacturer
            model
            flights {
                dateOfFlight
            }
        }
    }
    """
    result = schema.execute_sync(query, context_value=context)
    assert "gliders" in result.data
    assert result.data["gliders"] == [
        {
            "manufacturer": "GIN",
            "model": "Bolero 6",
            "flights": [{"dateOfFlight": "2023-01-01"}],
        }
    ]


def test_flights__relations(context):
    query = """
    query {
        flights {
            dateOfFlight
            glider {
                manufacturer
                model
            }
            site {
                name
            }
        }
    }
    """
    result = schema.execute_sync(query, context_value=context)
    assert "flights" in result.data
    assert result.data["flights"] == [
        {
            "dateOfFlight": "2023-01-01",
            "glider": {"manufacturer": "GIN", "model": "Bolero 6"},
            "site": {"name": "Pukerua Bay"},
        }
    ]
