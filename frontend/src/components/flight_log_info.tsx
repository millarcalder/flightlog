import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMultiply } from '@fortawesome/free-solid-svg-icons'
import Modal from 'react-bootstrap/Modal'
import StandardModal, { StandardModalProps } from './standard_modal'
import { FlightLog } from '../types'

interface FlightLogInfoProps extends StandardModalProps {
  flightlog: FlightLog
}

const FlightLogInfo = (props: FlightLogInfoProps) => {
  const { flightlog, ...otherProps } = props
  return (
    <StandardModal {...otherProps}>
      <Modal.Header>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h3 className="m-0">Flight Info</h3>
          <FontAwesomeIcon
            icon={faMultiply}
            size="2x"
            className="icon-button"
            onClick={() => {
              otherProps.handleClose()
            }}
          />
        </div>
      </Modal.Header>
      <Modal.Body>
        Max Altitude: {flightlog.max_altitude}ft
        <br />
        Min Altitude: {flightlog.min_altitude}ft
        <br />
        Distance Travelled:{' '}
        {(flightlog.dist_travelled_meters / 1000).toFixed(2)}km
      </Modal.Body>
    </StandardModal>
  )
}

export default FlightLogInfo
