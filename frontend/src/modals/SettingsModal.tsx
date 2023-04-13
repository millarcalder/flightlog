import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMultiply } from '@fortawesome/free-solid-svg-icons'
import StandardModal, { StandardModalProps } from './StandardModal'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { showMapLayer } from '../store/mainReducer'


const SettingsModal = (props: StandardModalProps) => {
  const dispatch = useAppDispatch()
  const showPathLayer = useAppSelector(state => state.main.mapLayers.pathLayer)
  const showHeatMapLayer = useAppSelector(state => state.main.mapLayers.heatMapLayer)

  return (
    <StandardModal {...props}>
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
              props.handleClose()
            }}
          />
        </div>
      </Modal.Header>
      <Modal.Body>
        <Form.Check
          type="checkbox"
          label={'Show Path'}
          onChange={() => {
            dispatch(showMapLayer({layer: 'pathLayer', show: !showPathLayer}))
          }}
          checked={showPathLayer}
        />
        <Form.Check
          type="checkbox"
          label={'Show Heat Map'}
          onChange={() => {
            dispatch(showMapLayer({layer: 'heatMapLayer', show: !showHeatMapLayer}))
          }}
          checked={showHeatMapLayer}
        />
      </Modal.Body>
    </StandardModal>
  )
}

export default SettingsModal
