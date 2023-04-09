import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMultiply } from '@fortawesome/free-solid-svg-icons'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import StandardModal, { StandardModalProps } from './standard_modal'

interface SettingsModalProps extends StandardModalProps {
  showPathLayer: boolean
  setShowPathLayer: Function
  showHeatMapLayer: boolean
  setShowHeatMapLayer: Function
}

const SettingsModal = (props: SettingsModalProps) => {
  const {
    showPathLayer,
    setShowPathLayer,
    showHeatMapLayer,
    setShowHeatMapLayer,
    ...otherProps
  } = props
  return (
    <StandardModal {...otherProps}>
      <Modal.Header>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h3 className="m-0">Settings</h3>
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
        <Form.Check
          type="checkbox"
          label={'Show Path'}
          onChange={() => {
            setShowPathLayer(!showPathLayer)
          }}
          checked={showPathLayer}
        />
        <Form.Check
          type="checkbox"
          label={'Show Heat Map'}
          onChange={() => {
            setShowHeatMapLayer(!showHeatMapLayer)
          }}
          checked={showHeatMapLayer}
        />
      </Modal.Body>
    </StandardModal>
  )
}

export default SettingsModal
