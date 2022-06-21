import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { TrackPoint } from '../types'

interface AltitudeGraphProps {
  data: TrackPoint[],
  style?: any
}
  
const AltitudeGraph = (props: AltitudeGraphProps) => {
  if (props.data.length == 0) return null;

  return <div style={props.style}>
    <HighchartsReact
      highcharts={Highcharts}
      options={{
        chart: {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          spacing: [0, 0, 0, 0],
          borderWidth: 0,
          borderRadius: 10,
          height: 250
        },
        credits: {
          enabled: false
        },
        title: {
          text: ''
        },
        series: [{
          type: 'line',
          lineWidth: 5,
          color: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: props.data.map((tp, i) => [(i+1)/props.data.length, `rgb(${255 * tp.altitude / 1000}, 0, 255)`])
          },
          data: props.data.map(tp => tp.altitude)
        }],
        legend: {
          enabled: false
        },
        xAxis: {
          labels: {
            enabled: false
          },
          tickLength: 0
        },
        yAxis: {
          title: {
            enabled: false
          },
          labels: {
            enabled: false
          },
          gridLineWidth: 0
        }
      }}
    />
  </div>
}

export default AltitudeGraph;
