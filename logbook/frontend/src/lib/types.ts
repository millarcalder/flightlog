export interface GliderInputs {
  manufacturer: string
  model: string
  rating: string
}

export interface Glider {
  id: number
  model: string
  manufacturer: string
  rating: string

  flights?: Flight[]
}

export interface SiteInputs {
  name: string
  description: string
  latitude: number
  longitude: number
  altitude: number
  country: string
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

export interface FlightInputs {
  date: Date
  site_id: number
  glider_id: number
  start_time: Date
  stop_time: Date
  max_altitude?: number
  wind_speed?: number
  wind_dir?: number
  comments: string
  igc_file?: File
}

export interface Flight {
  id: number
  date: Date
  site_id: number
  glider_id: number
  start_time: Date
  stop_time: Date
  max_altitude?: number
  wind_speed?: number
  wind_dir?: number
  comments: string
  igc_s3?: string
  flightlog_viewer_link?: string

  site?: Site
  glider?: Glider
}
