import Form from 'react-bootstrap/Form'
import StandardModal, { StandardModalProps } from './StandardModal'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { showMapLayer } from '../store/mainReducer'

const SettingsModal = (props: StandardModalProps) => {
  const dispatch = useAppDispatch()
  const showPathLayer = useAppSelector(
    (state) => state.main.mapLayers.pathLayer
  )
  const showHeatMapLayer = useAppSelector(
    (state) => state.main.mapLayers.heatMapLayer
  )

  return (
    <StandardModal title="Settings" {...props}>
      <Form.Check
        type="checkbox"
        label={'Show Path'}
        onChange={() => {
          dispatch(showMapLayer({ layer: 'pathLayer', show: !showPathLayer }))
        }}
        checked={showPathLayer}
      />
      <Form.Check
        type="checkbox"
        label={'Show Heat Map'}
        onChange={() => {
          dispatch(
            showMapLayer({ layer: 'heatMapLayer', show: !showHeatMapLayer })
          )
        }}
        checked={showHeatMapLayer}
      />
    </StandardModal>
  )
}

export default SettingsModal
