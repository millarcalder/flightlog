import { useState } from 'react';
import AltitudeGraph from './components/altitude_graph';
import Map from './components/map';
import { TrackPoint } from './types';

window.addEventListener("contextmenu", e => e.preventDefault());

function App() {
  const [data, setData] = useState<TrackPoint[]>([]);
  
  const handleSubmit = (e: any) => {
    let formdata = new FormData();
    formdata.append('igc', e.target.files[0]);
    fetch(`${process.env.REACT_APP_FLIGHTLOG_API_URL}parse-igc/extract-points`, {
      method: 'POST',
      body: formdata
    })
      .then(resp => resp.json())
      .then(result => {
        setData(result);
      })
      .catch(err => {
        console.log('caught error');
      });
  };

  return (
    <div className="App">
      <div>
        <Map data={data}>
          <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <input
                id='igc_file'
                type='file'
                onChange={handleSubmit}
                style={{
                  backgroundColor: 'white',
                  padding: 10,
                  margin: 10,
                  borderRadius: 10
                }}
              />
            </div>
            <AltitudeGraph data={data} style={{margin: 10}} />
          </div>
        </Map>
      </div>
    </div>
  );
}

export default App;
