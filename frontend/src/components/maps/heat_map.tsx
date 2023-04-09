import { PropsWithChildren, useMemo } from 'react'
import Map from 'react-map-gl'
import DeckGL from '@deck.gl/react'
import { Position } from '../../types'
import {
  generateHeatMapData,
  generateHeatMapLayer,
  generatePathData,
  generatePathLayer
} from './helpers'

interface HeatMapProps {
  positionLogs: Position[]
  showHeatMapLayer?: boolean
  showPathLayer?: boolean
}

const HeatMap = (props: PropsWithChildren<HeatMapProps>) => {
  const heatMapData = useMemo<number[][]>(
    () => generateHeatMapData(props.positionLogs),
    [props.positionLogs]
  )

  const pathData = useMemo<number[][]>(
    () => generatePathData({ positionLogs: props.positionLogs, flat: true }),
    [props.positionLogs]
  )

  const heatMapLayer = useMemo<any>(
    () => generateHeatMapLayer(heatMapData, props.showHeatMapLayer),
    [heatMapData, props.showHeatMapLayer]
  )

  const pathLayer = useMemo<any>(
    () =>
      generatePathLayer({
        pathData,
        width: 5,
        visible: props.showPathLayer
      }),
    [pathData, props.showPathLayer]
  )

  return (
    <DeckGL
      initialViewState={{
        latitude:
          props.positionLogs.length > 0
            ? props.positionLogs[0].latitude
            : -39.28154,
        longitude:
          props.positionLogs.length > 0
            ? props.positionLogs[0].longitude
            : 175.564541,
        zoom: 9,
        maxZoom: 16,
        pitch: 0,
        bearing: 0,
        maxPitch: 0
      }}
      controller={true}
      layers={[pathLayer, heatMapLayer]}
    >
      <Map mapStyle="mapbox://styles/mapbox/satellite-v9" />
      {props.children}
    </DeckGL>
  )
}

export default HeatMap
