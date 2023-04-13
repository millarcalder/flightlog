import { PropsWithChildren, useMemo } from 'react'
import Form from 'react-bootstrap/Form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleInfo,
  faRepeat,
  faCog
} from '@fortawesome/free-solid-svg-icons'
import AltitudeGraph from './components/graphs/AltitudeGraph'
import FlightPath3DMap from './components/maps/FlightPath3DMap'
import HeatMap from './components/maps/HeatMap'
import FlightLogInfoModal from './modals/FlightLogInfoModal'
import SettingsModal from './modals/SettingsModal'
import { useAppSelector, useAppDispatch } from './store/hooks'
import { setFlightlog, clearFlightlog, setView, showModal } from './store/mainReducer'

window.addEventListener('contextmenu', (e) => e.preventDefault())


const ComponentSelector = (props: PropsWithChildren<any>) => {
  const flightlog = useAppSelector(state => state.main.flightlog)
  const view = useAppSelector(state => state.main.view)
  const showPathLayer = useAppSelector(state => state.main.mapLayers.pathLayer)
  const showHeatMapLayer = useAppSelector(state => state.main.mapLayers.heatMapLayer)
  
  const positionLogs = useMemo(() => flightlog ? flightlog.position_logs : [], [flightlog])

  return view === 'terrain' ? (
    <FlightPath3DMap
      positionLogs={positionLogs}
      showPathLayer={showPathLayer}
    >
      {props.children}
    </FlightPath3DMap>
  ) : view === 'satallite' ? (
    <HeatMap
      positionLogs={positionLogs}
      showPathLayer={showPathLayer}
      showHeatMapLayer={showHeatMapLayer}
    >
      {props.children}
    </HeatMap>
  ) : (
    <div>{props.children}</div>
  )
}

const App = () => {
  const dispatch = useAppDispatch()
  const flightlog = useAppSelector(state => state.main.flightlog)
  const view = useAppSelector(state => state.main.view)
  const showFlightlogInfoModal = useAppSelector(state => state.main.modals.flightlogInfo)
  const showSettingsModal = useAppSelector(state => state.main.modals.settings)

  const handleSubmit = (e: any) => {
    let formdata = new FormData()
    formdata.append('igc', e.target.files[0])
    fetch(
      `${process.env.REACT_APP_FLIGHTLOG_API_URL}parse-igc/extract-flight-log`,
      {
        method: 'POST',
        body: formdata
      }
    )
      .then((resp) => resp.json())
      .then((result) => {
        dispatch(setFlightlog(result))
      })
      .catch((err) => {
        dispatch(clearFlightlog())
      })
  }

  return (
    <div className="App">
      <div>
        <ComponentSelector>
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Form.Control
                type="file"
                onChange={handleSubmit}
                style={{
                  margin: 10,
                  width: 'auto'
                }}
              />
              <div>
                <FontAwesomeIcon
                  icon={faRepeat}
                  size="3x"
                  inverse
                  className="icon-button"
                  style={{
                    margin: 10
                  }}
                  onClick={() => {
                    dispatch(setView(view == 'terrain' ? 'satallite' : 'terrain'))
                  }}
                />
                <FontAwesomeIcon
                  icon={faCog}
                  size="3x"
                  inverse
                  className="icon-button"
                  style={{
                    margin: 10
                  }}
                  onClick={() => {
                    dispatch(showModal({modal: 'settings', 'show': true}))
                  }}
                />
                <FontAwesomeIcon
                  icon={faCircleInfo}
                  size="3x"
                  inverse
                  className="icon-button"
                  style={{
                    margin: 10
                  }}
                  onClick={() => {
                    dispatch(showModal({modal: 'flightlogInfo', 'show': true}))
                  }}
                />
              </div>
            </div>
            <AltitudeGraph
              data={flightlog ? flightlog.position_logs : []}
              style={{ margin: 10 }}
            />
          </div>
        </ComponentSelector>
      </div>

      {showFlightlogInfoModal && flightlog !== undefined ? (
        <FlightLogInfoModal
          show={true}
          handleClose={() => {
            dispatch(showModal({modal: 'flightlogInfo', show: false}))
          }}
          flightlog={flightlog!}
        />
      ) : null}
      {showSettingsModal ? (
        <SettingsModal
          show={true}
          handleClose={() => {
            dispatch(showModal({modal: 'settings', show: false}))
          }}
        />
      ) : null}
    </div>
  )
}

export default App
