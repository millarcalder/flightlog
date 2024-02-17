import StandardModal, { StandardModalProps } from './StandardModal'
import { FlightLog } from '../types'

interface FlightLogInfoModalProps extends StandardModalProps {
  flightlog: FlightLog
}

const FlightLogInfoModal = (props: FlightLogInfoModalProps) => {
  const { flightlog, ...otherProps } = props
  return (
    <StandardModal title="Info" {...otherProps}>
      Max Altitude: {flightlog.max_altitude}ft
      <br />
      Min Altitude: {flightlog.min_altitude}ft
      <br />
      Distance Travelled: {(flightlog.dist_travelled_meters / 1000).toFixed(2)}
      km
    </StandardModal>
  )
}

export default FlightLogInfoModal
