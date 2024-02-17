import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { Position } from '../../types'
import { useMemo, useState } from 'react'

interface AltitudeGraphProps {
  data: Position[]
  style?: any
}

const AltitudeGraph = (props: AltitudeGraphProps) => {
  const [showGraph, setShowGraph] = useState(false)
  const backgroundColor = useMemo(
    () => (showGraph ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'),
    [showGraph]
  )
  const textColor = useMemo(
    () => (showGraph ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.7)'),
    [showGraph]
  )

  if (props.data.length === 0) return null

  return (
    <div
      style={{
        ...props.style,
        display: 'flex',
        flexDirection: 'row',
        height: 250
      }}
    >
      <button
        style={{
          backgroundColor: backgroundColor,
          border: 'none',
          borderRadius: 10,
          padding: 10,
          marginRight: 10
        }}
        onClick={() => {
          setShowGraph(!showGraph)
        }}
      >
        <p
          style={{
            color: textColor,
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            margin: 0,
            padding: 0
          }}
        >
          Altitude
        </p>
      </button>
      {showGraph ? (
        <div style={{ width: '100%' }}>
          <HighchartsReact
            highcharts={Highcharts}
            options={{
              chart: {
                backgroundColor: backgroundColor,
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
              series: [
                {
                  type: 'line',
                  lineWidth: 5,
                  color: {
                    linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                    stops: props.data.map((tp, i) => [
                      (i + 1) / props.data.length,
                      `rgb(${(255 * tp.altitude) / 1000}, 0, 255)`
                    ])
                  },
                  data: props.data.map((tp) => tp.altitude)
                }
              ],
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
      ) : null}
    </div>
  )
}

export default AltitudeGraph
