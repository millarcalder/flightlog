export interface Position {
  date_time: string
  latitude: number
  longitude: number
  altitude: number
}

export interface FlightLog {
  position_logs: Position[]
  start: Position
  finish: Position
  min_altitude: number
  max_altitude: number
  dist_travelled_meters: number
}
