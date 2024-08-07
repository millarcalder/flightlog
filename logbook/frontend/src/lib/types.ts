export interface SiteInputs {
  name: string
  description: string
  latitude: number
  longitude: number
  altitude: number
  country: string
}

export interface GliderInputs {
  manufacturer: string
  model: string
  rating: string
}

export interface FlightInputs {
  dateOfFlight: Date
  siteId: number
  gliderId: number
  startTime: Date
  stopTime: Date
  maxAltitude?: number
  windSpeed?: number
  windDir?: number
  comments: string
  igcFile?: FileList
}

export interface Glider {
  id: number
  model: string
  manufacturer: string
  rating: string

  flights?: Flight[]
}

export interface Site {
  id: number
  name: string
  description: string
  latitude: number
  longitude: number
  altitude: number
  country: string

  flights?: Flight[]
}

export interface Flight {
  id: number
  dateOfFlight: Date
  siteId: number
  gliderId: number
  startTime: Date
  stopTime: Date
  maxAltitude?: number
  windSpeed?: number
  windDir?: number
  comments: string

  glider?: Glider
}
