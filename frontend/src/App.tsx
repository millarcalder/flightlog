import { useState } from 'react';
import Map from './components/maps/basic';

window.addEventListener("contextmenu", e => e.preventDefault());

function App() {
  const [data, setData] = useState<any>([]);
  
  const handleSubmit = (e: any) => {
    let formdata = new FormData();
    formdata.append('igc', e.target.files[0]);
    fetch('http://flightlog.kube.millarcalder.com/parse-igc/get-path', {
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
          <input
            id='igc_file'
            type='file'
            onChange={handleSubmit}
            style={{
              backgroundColor: 'white',
              padding: 5,
              margin: 5,
              borderRadius: 5,
            }}
          />
        </Map>
      </div>
    </div>
  );
}

export default App;
