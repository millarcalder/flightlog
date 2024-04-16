import pytest
from logbook.lib.graphql_schema import schema
from logbook.lib.graphql_schema import CustomContext


@pytest.mark.parametrize(
    ('country', 'site_names'),
    (
        (None, ['Death Star', 'Stubai - Elfer', 'Pukerua Bay']),
        ('Austria', ['Stubai - Elfer'])
    )
)
def test_sites(country, site_names):
    query = """
        query TestQuery($country: String) {
            sites(country: $country) {
                name
            }
        }
    """
    result = schema.execute_sync(query, variable_values={'country': country}, context_value=CustomContext(1))
    assert 'sites' in result.data
    for site_name in site_names:
        assert {'name': site_name} in result.data['sites']


def test_site_relations():
    query = """
        {
            sites {
                name
                flights {
                    dateOfFlight
                }
            }
        }
    """
    result = schema.execute_sync(query, context_value=CustomContext(1))
    assert 'sites' in result.data
    assert {'name': 'Stubai - Elfer', 'flights': [{'dateOfFlight': '2023-01-01'}]}


def test_gliders():
    query = """
    {
        gliders {
            manufacturer
            model
        }
    }
    """
    result = schema.execute_sync(query, context_value=CustomContext(1))
    assert 'gliders' in result.data
    assert result.data['gliders'] == [{'manufacturer': 'GIN', 'model': 'Bolero 6'}]
