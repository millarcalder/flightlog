import { PropsWithChildren, useState } from 'react'
import Form from 'react-bootstrap/Form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleInfo,
  faRepeat,
  faCog,
} from '@fortawesome/free-solid-svg-icons'
import AltitudeGraph from './components/graphs/altitude_graph'
import FlightPath3DMap from './components/maps/flight_path_3d_map'
import HeatMap from './components/maps/heat_map'
import FlightLogInfo from './components/flight_log_info'
import SettingsModal from './components/settings_modal'
import { FlightLog, Position } from './types'

window.addEventListener('contextmenu', (e) => e.preventDefault())

type MapView = 'terrain' | 'satallite'

interface ComponentSelectorProps {
  positionLogs: Position[]
  view: MapView
  showPathLayer: boolean
  showHeatMapLayer: boolean
}

const ComponentSelector = (
  props: PropsWithChildren<ComponentSelectorProps>
) => {
  return props.view === 'terrain' ? (
    <FlightPath3DMap
      positionLogs={props.positionLogs}
      showPathLayer={props.showPathLayer}
    >
      {props.children}
    </FlightPath3DMap>
  ) : props.view === 'satallite' ? (
    <HeatMap
      positionLogs={props.positionLogs}
      showHeatMapLayer={props.showHeatMapLayer}
      showPathLayer={props.showPathLayer}
    >
      {props.children}
    </HeatMap>
  ) : (
    <div>{props.children}</div>
  )
}

const App = () => {
  const [flightlog, setFlightlog] = useState<FlightLog>()
  const [showFlightlogInfo, setShowFlightlogInfo] = useState<boolean>(false)
  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [view, setView] = useState<MapView>('terrain')
  const [showPathLayer, setshowPathLayer] = useState<boolean>(true)
  const [showHeatMapLayer, setShowHeatMapLayer] = useState<boolean>(true)

  const handleSubmit = (e: any) => {
    let formdata = new FormData()
    formdata.append('igc', e.target.files[0])
    fetch(
      `${process.env.REACT_APP_FLIGHTLOG_API_URL}parse-igc/extract-flight-log`,
      {
        method: 'POST',
        body: formdata,
      }
    )
      .then((resp) => resp.json())
      .then((result) => {
        setFlightlog(result)
      })
      .catch((err) => {
        console.log('caught error')
      })
  }

  return (
    <div className="App">
      <div>
        <ComponentSelector
          positionLogs={flightlog ? flightlog.positionLogs : []}
          view={view}
          showPathLayer={showPathLayer}
          showHeatMapLayer={showHeatMapLayer}
        >
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Form.Control
                type="file"
                onChange={handleSubmit}
                style={{
                  margin: 10,
                  width: 'auto',
                }}
              />
              <div>
                <FontAwesomeIcon
                  icon={faRepeat}
                  size="3x"
                  inverse
                  className="icon-button"
                  style={{
                    margin: 10,
                  }}
                  onClick={() => {
                    if (view === 'terrain') setView('satallite')
                    else setView('terrain')
                  }}
                />
                <FontAwesomeIcon
                  icon={faCog}
                  size="3x"
                  inverse
                  className="icon-button"
                  style={{
                    margin: 10,
                  }}
                  onClick={() => {
                    setShowSettings(true)
                  }}
                />
                <FontAwesomeIcon
                  icon={faCircleInfo}
                  size="3x"
                  inverse
                  className="icon-button"
                  style={{
                    margin: 10,
                  }}
                  onClick={() => {
                    setShowFlightlogInfo(flightlog !== undefined)
                  }}
                />
              </div>
            </div>
            <AltitudeGraph
              data={flightlog ? flightlog.positionLogs : []}
              style={{ margin: 10 }}
            />
          </div>
        </ComponentSelector>
      </div>

      {showFlightlogInfo && flightlog !== undefined ? (
        <FlightLogInfo
          show={true}
          handleClose={() => {
            setShowFlightlogInfo(false)
          }}
          flightlog={flightlog!}
        />
      ) : null}
      {showSettings ? (
        <SettingsModal
          show={true}
          handleClose={() => {
            setShowSettings(false)
          }}
          showPathLayer={showPathLayer}
          setShowPathLayer={setshowPathLayer}
          showHeatMapLayer={showHeatMapLayer}
          setShowHeatMapLayer={setShowHeatMapLayer}
        />
      ) : null}
    </div>
  )
}

export default App
