import Form from 'react-bootstrap/Form'
import StandardModal, { StandardModalProps } from './StandardModal'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { showMapLayer, setPathWidth } from '../store/mainReducer'

const PathSettings = () => {
  const dispatch = useAppDispatch()
  const showPathLayer = useAppSelector(
    (state) => state.main.settings.layers.path
  )
  const pathWidth = useAppSelector(
    (state) => state.main.settings.pathWidth
  )

  return (
    <>
      <Form.Check
        type="checkbox"
        label={'Show Path'}
        onChange={() => {
          dispatch(showMapLayer({ layer: 'path', show: !showPathLayer }))
        }}
        checked={showPathLayer}
      />
      <div
        style={{
          transition: 'max-height 0.2s ease-out',
          maxHeight: showPathLayer ? 50 : 0
        }}
      >
        {/* Only show the settings if the path layer is enabled */}
        {showPathLayer ? (
          <>
            <Form.Label>Path Width</Form.Label>
            <Form.Range
              defaultValue={pathWidth}
              onChange={(e) => {
                dispatch(setPathWidth(parseInt(e.target.value)))
              }}
              max={15}
              min={1}
              step={1}
            />
          </>
        ) : null}
      </div>
      <hr />
    </>
  )
}

const HeatMapSettings = () => {
  const dispatch = useAppDispatch()
  const showHeatMapLayer = useAppSelector(
    (state) => state.main.settings.layers.heatMap
  )

  return (
    <>
      <Form.Check
        type="checkbox"
        label={'Show Heat Map'}
        onChange={() => {
          dispatch(
            showMapLayer({ layer: 'heatMap', show: !showHeatMapLayer })
          )
        }}
        checked={showHeatMapLayer}
      />
    </>
  )
}

const SettingsModal = (props: StandardModalProps) => {
  return (
    <StandardModal title="Settings" {...props}>
      <PathSettings />
      <HeatMapSettings />
    </StandardModal>
  )
}

export default SettingsModal
