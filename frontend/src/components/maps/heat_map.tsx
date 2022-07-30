import { PropsWithChildren, useMemo } from 'react';
import Map from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { Position } from '../../types';

interface HeatMapProps {
  position_logs: Position[]
}

const HeatMap = (props: PropsWithChildren<HeatMapProps>) => {
  const data = useMemo(() => {
    let res = []
    for(let i=1; i < props.position_logs.length; i++) {
      let pos = props.position_logs[i]
      let prev_pos = props.position_logs[i-1]
      res.push([pos.longitude, pos.latitude, pos.altitude - prev_pos.altitude])
    }
    return res
  }, [props.position_logs])

  const layers = [
    new HeatmapLayer({
      data,
      id: 'heatmp-layer',
      pickable: false,
      getPosition: d => [d[0], d[1]],
      getWeight: d => d[2],
      radiusPixels: 30,
      intensity: 1,
      threshold: 0.03
    })
  ]

  return (
    <DeckGL initialViewState={{
      latitude: props.position_logs.length > 0 ? props.position_logs[0].latitude : -39.281540,
      longitude: props.position_logs.length > 0 ? props.position_logs[0].longitude : 175.564541,
      zoom: 9,
      maxZoom: 16,
      pitch: 0,
      bearing: 0
    }} controller={true} layers={layers}>
      <Map mapStyle='mapbox://styles/mapbox/satellite-v9' />
      {props.children}
    </DeckGL>
  )
}

export default HeatMap
