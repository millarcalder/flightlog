import {
  Site,
  SiteInputs,
  Glider,
  GliderInputs,
  FlightInputs,
  Flight
} from './types'

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
  addGlider(accessToken: string, input: GliderInputs): Promise<Glider>

  fetchSites(accessToken: string): Promise<Site[]>
  addSite(accessToken: string, input: SiteInputs): Promise<Site>

  addFlight(accessToken: string, input: FlightInputs): Promise<Flight>
}

class MockedQueries implements IQueries {
  site1 = {
    id: 1,
    name: 'Kariotahi (low side)',
    description: '...',
    latitude: -37.3258,
    longitude: 174.677,
    altitude: 50,
    country: 'New Zealand'
  }
  site2 = {
    id: 2,
    name: 'Stubai (Elfer)',
    description: '...',
    latitude: 47.098611,
    longitude: 11.32425,
    altitude: 1788,
    country: 'Austria'
  }
  glider1 = {
    id: 1,
    manufacturer: 'GIN',
    model: 'Bolero',
    rating: 'EN-A'
  }
  glider2 = {
    id: 2,
    manufacturer: 'GIN',
    model: 'Evora',
    rating: 'EN-B'
  }
  flight1 = {
    id: 1,
    date: new Date('01-01-2024'),
    site_id: 1, // Kariotahi
    glider_id: 1, // GIN Bolero
    start_time: new Date('01-01-2024T12:00:00'),
    stop_time: new Date('01-01-2024T12:30:00'),
    comments: '...',
    glider: this.glider1
  }
  flight2 = {
    id: 2,
    date: new Date('01-01-2023'),
    site_id: 2, // Stubai
    glider_id: 1, // GIN Bolero
    start_time: new Date('01-01-2024T12:00:00'),
    stop_time: new Date('01-01-2024T12:30:00'),
    comments: '...',
    glider: this.glider1
  }
  flight3 = {
    id: 3,
    date: new Date('01-01-2023'),
    site_id: 2, // Stubai
    glider_id: 1, // GIN Bolero
    start_time: new Date('01-01-2024T13:00:00'),
    stop_time: new Date('01-01-2024T13:30:00'),
    comments: '...',
    glider: this.glider1
  }
  flight4 = {
    id: 4,
    date: new Date('02-01-2023'),
    site_id: 2, // Stubai
    glider_id: 1, // GIN Bolero
    start_time: new Date('02-01-2024T13:00:00'),
    stop_time: new Date('02-01-2024T13:30:00'),
    comments: '...',
    glider: this.glider1
  }

  currSiteId = 3
  currGliderId = 3
  currFlightId = 5

  fetchGliders(accessToken: string): Promise<Glider[]> {
    return new Promise((resolve) => {
      console.log('Mocked method: IQueries.fetchGliders')

      setTimeout(() => {
        if (accessToken === 'imatoken') {
          resolve([
            {
              ...this.glider1
            },
            {
              ...this.glider2
            }
          ])
        } else {
          resolve([])
        }
      }, 1000)
    })
  }

  addGlider(accessToken: string, input: GliderInputs): Promise<Glider> {
    return new Promise((resolve) => {
      console.log('Mocked method: IQueries.addGlider')

      setTimeout(() => {
        if (accessToken === 'imatoken') {
          const newGlider: Glider = {
            id: this.currGliderId,
            model: input.model,
            manufacturer: input.manufacturer,
            rating: input.rating
          }
          this.currGliderId++
          resolve(newGlider)
        } else {
          throw 'Authorization Error'
        }
      }, 1000)
    })
  }

  fetchSites(accessToken: string): Promise<Site[]> {
    return new Promise((resolve) => {
      console.log('Mocked method: IQueries.fetchSites')

      setTimeout(() => {
        if (accessToken === 'imatoken') {
          resolve([
            {
              ...this.site1,
              flights: [this.flight1]
            },
            {
              ...this.site2,
              flights: [this.flight2, this.flight3, this.flight4]
            }
          ])
        } else {
          resolve([])
        }
      }, 1000)
    })
  }

  addSite(accessToken: string, input: SiteInputs): Promise<Site> {
    return new Promise((resolve) => {
      console.log('Mocked method: IQueries.addSite')

      setTimeout(() => {
        if (accessToken === 'imatoken') {
          const newSite: Site = {
            id: this.currSiteId,
            name: input.name,
            description: input.description,
            latitude: input.latitude,
            longitude: input.longitude,
            altitude: input.altitude,
            country: input.country
          }
          this.currSiteId++
          resolve(newSite)
        } else {
          throw 'Authorization Error'
        }
      }, 1000)
    })
  }

  addFlight(accessToken: string, input: FlightInputs): Promise<Flight> {
    return new Promise((resolve) => {
      console.log('Mocked method: IQueries.addFlight')

      setTimeout(() => {
        if (accessToken === 'imatoken') {
          const newFlight: Flight = {
            id: this.currFlightId,
            date: input.date,
            site_id: input.site_id,
            glider_id: input.glider_id,
            start_time: input.start_time,
            stop_time: input.stop_time,
            max_altitude: input.max_altitude,
            wind_speed: input.wind_speed,
            wind_dir: input.wind_dir,
            comments: input.comments
          }
          this.currFlightId++
          resolve(newFlight)
        } else {
          throw 'Authorization Error'
        }
      }, 1000)
    })
  }
}

const queries = new MockedQueries()
export default queries
