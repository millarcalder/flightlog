import { Site, Flight, Glider } from './types';

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
    fetchGliders(accessToken: string): Promise<Glider[]>
    fetchSites(accessToken: string): Promise<Site[]>
}


class MockedQueries implements IQueries {
    site1 = {
        'id': 1,
        'name': 'Kariotahi (low side)',
        'description': '...',
        'latitude': -37.3258,
        'longitude': 174.677,
        'altitude': 50
    }
    site2 = {
        'id': 2,
        'name': 'Stubai (Elfer)',
        'description': '...',
        'latitude': 47.098611,
        'longitude': 11.324250,
        'altitude': 1788
    }
    glider1 = {
        'id': 1,
        'manufacturer': 'GIN',
        'model': 'Bolero',
        'rating': 'EN-A',
    }
    glider2 = {
        'id': 2,
        'manufacturer': 'GIN',
        'model': 'Evora',
        'rating': 'EN-B',
    }
    flight1 = {
        'id': 1,
        'date': new Date("01-01-2024"),
        "site_id": 1, // Kariotahi
        "glider_id": 1, // GIN Bolero
        "start_time": new Date("01-01-2024T12:00:00"),
        "stop_time": new Date("01-01-2024T12:30:00"),
        "comments": "...",
        "glider": this.glider1
    }
    flight2 = {
        'id': 2,
        'date': new Date("01-01-2023"),
        "site_id": 2, // Stubai
        "glider_id": 1, // GIN Bolero
        "start_time": new Date("01-01-2024T12:00:00"),
        "stop_time": new Date("01-01-2024T12:30:00"),
        "comments": "...",
        "glider": this.glider1
    }
    flight3 = {
        'id': 3,
        'date': new Date("01-01-2023"),
        "site_id": 2, // Stubai
        "glider_id": 1, // GIN Bolero
        "start_time": new Date("01-01-2024T13:00:00"),
        "stop_time": new Date("01-01-2024T13:30:00"),
        "comments": "...",
        "glider": this.glider1
    }
    flight4 = {
        'id': 4,
        'date': new Date("02-01-2023"),
        "site_id": 2, // Stubai
        "glider_id": 1, // GIN Bolero
        "start_time": new Date("02-01-2024T13:00:00"),
        "stop_time": new Date("02-01-2024T13:30:00"),
        "comments": "...",
        "glider": this.glider1
    }

    fetchGliders(accessToken: string): Promise<Glider[]> {
        return new Promise((resolve) => {
            console.log('Mocked gliders request!')
            
            setTimeout(() => {
                if (accessToken === 'imatoken') {
                    resolve([{
                        ...this.glider1
                    }, {
                        ...this.glider2
                    }])
                } else {
                    resolve([])
                }
            }, 1000)
        })
    }

    fetchSites(accessToken: string): Promise<Site[]> {
        return new Promise((resolve) => {
            console.log('Mocked sites request!')
            
            setTimeout(() => {
                if (accessToken === 'imatoken') {
                    resolve([{
                        ...this.site1,
                        'flights': [this.flight1]
                    }, {
                        ...this.site2,
                        flights: [this.flight2, this.flight3, this.flight4]
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
