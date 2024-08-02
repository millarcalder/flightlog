import { format } from 'date-fns'
import {
  Site,
  SiteInputs,
  Glider,
  GliderInputs,
  FlightInputs,
  Flight
} from './types'

export interface IQueries {
  fetchGliders(accessToken: string): Promise<Glider[]>
  addGlider(accessToken: string, input: GliderInputs): Promise<Glider>

  fetchSites(accessToken: string): Promise<Site[]>
  addSite(accessToken: string, input: SiteInputs): Promise<Site>
  fetchSiteFlights(accessToken: string, siteId: number): Promise<Flight[]>

  uploadIgcFile(
    accessToken: string,
    flightId: number,
    igcFile: File
  ): Promise<null>
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
    dateOfFlight: new Date('01-01-2024'),
    siteId: 1, // Kariotahi
    gliderId: 1, // GIN Bolero
    startTime: new Date('01-01-2024T12:00:00'),
    stopTime: new Date('01-01-2024T12:30:00'),
    comments: '...',
    glider: this.glider1
  }
  flight2 = {
    id: 2,
    dateOfFlight: new Date('01-01-2023'),
    siteId: 2, // Stubai
    gliderId: 1, // GIN Bolero
    startTime: new Date('01-01-2024T12:00:00'),
    stopTime: new Date('01-01-2024T12:30:00'),
    comments: '...',
    glider: this.glider1
  }
  flight3 = {
    id: 3,
    dateOfFlight: new Date('01-01-2023'),
    siteId: 2, // Stubai
    gliderId: 1, // GIN Bolero
    startTime: new Date('01-01-2024T13:00:00'),
    stopTime: new Date('01-01-2024T13:30:00'),
    comments: '...',
    glider: this.glider1
  }
  flight4 = {
    id: 4,
    dateOfFlight: new Date('02-01-2023'),
    siteId: 2, // Stubai
    gliderId: 1, // GIN Bolero
    startTime: new Date('02-01-2024T13:00:00'),
    stopTime: new Date('02-01-2024T13:30:00'),
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
          throw Error('Authorization Error')
        }
      }, 1000)
    })
  }

  fetchSites(accessToken: string): Promise<Site[]> {
    return new Promise((resolve) => {
      console.log('Mocked method: IQueries.fetchSites')

      setTimeout(() => {
        if (accessToken === 'imatoken') {
          resolve([{ ...this.site1 }, { ...this.site2 }])
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
          throw Error('Authorization Error')
        }
      }, 1000)
    })
  }

  fetchSiteFlights(accessToken: string, siteId: number): Promise<Flight[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (siteId == 1) {
          resolve([this.flight1])
        } else if (siteId == 2) {
          resolve([this.flight2, this.flight3, this.flight4])
        } else {
          resolve([])
        }
      })
    })
  }

  uploadIgcFile(
    accessToken: string,
    flightId: number, // eslint-disable-line
    igcFile: File // eslint-disable-line
  ): Promise<null> {
    return new Promise((resolve) => {
      console.log('Mocked method: IQueries.uploadIgcFile')

      setTimeout(() => {
        if (accessToken === 'imatoken') {
          resolve(null)
        } else {
          throw Error('Authorization Error')
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
            dateOfFlight: input.dateOfFlight,
            siteId: input.siteId,
            gliderId: input.gliderId,
            startTime: input.startTime,
            stopTime: input.stopTime,
            maxAltitude: input.maxAltitude,
            windSpeed: input.windSpeed,
            windDir: input.windDir,
            comments: input.comments
          }
          this.currFlightId++
          resolve(newFlight)
        } else {
          throw Error('Authorization Error')
        }
      }, 1000)
    })
  }
}

class APIQueries implements IQueries {
  fetchGliders(accessToken: string): Promise<Glider[]> {
    return fetch(`${process.env.REACT_APP_LOGBOOK_API}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        query: `{
          gliders {
            id
            model
            manufacturer
            rating
          }
        }`
      })
    })
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        return data['data']['gliders']
      })
  }

  addGlider(accessToken: string, input: GliderInputs): Promise<Glider> {
    return fetch(`${process.env.REACT_APP_LOGBOOK_API}/api/glider`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(input)
    }).then((res) => {
      if (res.ok) return res.json()
    })
  }

  fetchSites(accessToken: string): Promise<Site[]> {
    return fetch(`${process.env.REACT_APP_LOGBOOK_API}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        query: `{
          sites {
            id
            name
            description
            latitude
            longitude
            altitude
            country
          }
        }`
      })
    })
      .then((res) => {
        return res.json()
      })
      .then((data): Site[] => {
        return data['data']['sites']
      })
  }

  addSite(accessToken: string, input: SiteInputs): Promise<Site> {
    return fetch(`${process.env.REACT_APP_LOGBOOK_API}/api/site`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(input)
    })
      .then((res) => {
        if (res.ok) return res.json()
      })
      .then((site): Site => {
        // the site will have zero flights initially
        site.flights = []
        return site
      })
  }

  fetchSiteFlights(accessToken: string, siteId: number): Promise<Flight[]> {
    return fetch(`${process.env.REACT_APP_LOGBOOK_API}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        query: `{
          flights (siteId: ${siteId}) {
            id
            dateOfFlight
            siteId
            gliderId
            startTime
            stopTime
            maxAltitude
            windSpeed
            windDir
            comments

            glider {
              id
              manufacturer
              model
              rating
            }
          }
        }`
      })
    })
      .then((res) => {
        return res.json()
      })
      .then((data): Flight[] => {
        // convert the dateOfFlight field from a string to a Date object
        return data['data']['flights'].map((flight: Flight) => {
          flight.dateOfFlight = new Date(flight.dateOfFlight)
          return flight
        })
      })
  }

  uploadIgcFile(
    accessToken: string,
    flightId: number,
    igcFile: File
  ): Promise<null> {
    const formdata = new FormData()
    formdata.append('igc', igcFile)

    return fetch(
      `${process.env.REACT_APP_LOGBOOK_API}/api/flight/${flightId}/upload-igc`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        body: formdata
      }
    ).then((res) => {
      if (res.ok) return null
      throw 'Unauthenticated'
    })
  }

  addFlight(accessToken: string, input: FlightInputs): Promise<Flight> {
    return fetch(`${process.env.REACT_APP_LOGBOOK_API}/api/flight`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        dateOfFlight: format(input.dateOfFlight, 'yyyy-MM-dd'),
        siteId: input.siteId,
        gliderId: input.gliderId,
        startTime: input.startTime.toJSON(),
        stopTime: input.stopTime.toJSON(),
        maxAltitude: input.maxAltitude,
        windSpeed: input.windSpeed,
        windDir: input.windDir,
        comments: input.comments
      })
    })
      .then((res) => {
        if (res.ok) return res.json()
      })
      .then((flight): Flight => {
        // convert the dateOfFlight field from a string to a Date object
        flight.dateOfFlight = new Date(flight.dateOfFlight)
        return flight
      })
  }
}

const queries = process.env.REACT_APP_MOCK_QUERIES
  ? new MockedQueries()
  : new APIQueries()
export default queries
