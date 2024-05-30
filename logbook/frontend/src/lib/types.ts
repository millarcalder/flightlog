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

    flights?: Flight[]
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
