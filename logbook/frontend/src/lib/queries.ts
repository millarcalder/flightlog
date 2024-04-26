import { Site, Flight } from './types';

const sitesQuery = `
{
    sites {
        id
        name
        description
        latitude
        longitude
        altitude

        flights {
            id
            dateOfFlight
        }
    }
}
`

export interface IQueries {
    fetchSites(accessToken: string): Promise<Site[]>
}


class MockedQueries implements IQueries {
    fetchSites(accessToken: string): Promise<Site[]> {
        return new Promise((resolve) => {
            console.log('Mocked sites request!')
            const site1 = {
                'id': 1,
                'name': 'Kariotahi (low side)',
                'description': '...',
                'latitude': -37.3258,
                'longitude': 174.677,
                'altitude': 50
            }
            const site2 = {
                'id': 2,
                'name': 'Stubai (Elfer)',
                'description': '...',
                'latitude': 47.098611,
                'longitude': 11.324250,
                'altitude': 1788
            }
            const flight1 = {
                'id': 1,
                'date': new Date("01-01-2024"),
                "site_id": 1, // Kariotahi
                "glider_id": 1, // GIN Bolero
                "start_time": new Date("01-01-2024T12:00:00"),
                "stop_time": new Date("01-01-2024T12:30:00"),
                "comments": "..."
            }
            const flight2 = {
                'id': 2,
                'date': new Date("01-01-2023"),
                "site_id": 2, // Stubai
                "glider_id": 1, // GIN Bolero
                "start_time": new Date("01-01-2024T12:00:00"),
                "stop_time": new Date("01-01-2024T12:30:00"),
                "comments": "..."
            }
            setTimeout(() => {
                if (accessToken === 'imatoken') {
                    resolve([{
                        ...site1,
                        'flights': [flight1]
                    }, {
                        ...site2,
                        flights: [flight2]
                    }])
                } else {
                    resolve([])
                }
            }, 1000)
        })
    }
}

const queries = new MockedQueries()
export default queries
