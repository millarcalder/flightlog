import { PropsWithChildren, useState } from 'react';
import Form from 'react-bootstrap/Form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faRepeat } from '@fortawesome/free-solid-svg-icons'
import AltitudeGraph from './components/graphs/altitude_graph';
import FlightPath3DMap from './components/maps/flight_path_3d_map';
import HeatMap from './components/maps/heat_map';
import FlightLogInfo from './components/flight_log_info';
import { FlightLog, Position } from './types';

window.addEventListener("contextmenu", e => e.preventDefault());


interface ComponentSelectorProps {
  position_logs: Position[]
  flight_path_3d_map: boolean
  heat_map: boolean
}
const ComponentSelector = (props: PropsWithChildren<ComponentSelectorProps>) => {
  return props.flight_path_3d_map ? <FlightPath3DMap position_logs={props.position_logs}>
    {props.children}
  </FlightPath3DMap> : props.heat_map ? <HeatMap position_logs={props.position_logs}>
    {props.children}
  </HeatMap> : <div>
    {props.children}
  </div>
}


const App = () => {
  const [flightlog, setFlightlog] = useState<FlightLog>()
  const [showFlightlogInfo, setShowFlightlogInfo] = useState<boolean>(false)
  const [showFlightPath3dPath, setShowFlightPath3dPath] = useState<boolean>(true)
  const [showHeatMap, setShowHeatMap] = useState<boolean>(false)
  
  const handleSubmit = (e: any) => {
    let formdata = new FormData();
    formdata.append('igc', e.target.files[0]);
    fetch(`${process.env.REACT_APP_FLIGHTLOG_API_URL}parse-igc/extract-flight-log`, {
      method: 'POST',
      body: formdata
    })
      .then(resp => resp.json())
      .then(result => {
        setFlightlog(result);
      })
      .catch(err => {
        console.log('caught error');
      });
  };

  return (
    <div className="App">
      <div>
        <ComponentSelector
          position_logs={flightlog ? flightlog.position_logs : []}
          flight_path_3d_map={showFlightPath3dPath}
          heat_map={showHeatMap}
        >
          <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Form.Control
                type='file'
                onChange={handleSubmit}
                style={{
                  margin: 10,
                  width: 'auto'
                }}
              />
              <div>
                <FontAwesomeIcon
                  icon={faRepeat}
                  size='3x'
                  inverse
                  className='icon-button'
                  style={{
                    margin: 10
                  }}
                  onClick={() => {
                    setShowFlightPath3dPath(!showFlightPath3dPath)
                    setShowHeatMap(!showHeatMap)
                  }}
                />
                <FontAwesomeIcon
                  icon={faCircleInfo}
                  size='3x'
                  inverse
                  className='icon-button'
                  style={{
                    margin: 10
                  }}
                  onClick={() => {
                    setShowFlightlogInfo(flightlog != undefined)
                  }}
                />
              </div>
            </div>
            <AltitudeGraph data={flightlog ? flightlog.position_logs : []} style={{margin: 10}} />
          </div>
        </ComponentSelector>
      </div>

      {showFlightlogInfo && flightlog != undefined ? 
        <FlightLogInfo show={true} handleClose={() => {
          setShowFlightlogInfo(false)
        }} flightlog={flightlog!} />
        : null
      }
    </div>
  );
}

export default App;
