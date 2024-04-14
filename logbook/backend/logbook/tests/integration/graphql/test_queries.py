import pytest
from logbook.lib.graphql_schema import schema


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
    result = schema.execute_sync(query, variable_values={'country': country})
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
    result = schema.execute_sync(query)
    assert 'sites' in result.data
    assert {'name': 'Stubai - Elfer', 'flights': [{'dateOfFlight': '2023-01-01'}]}
