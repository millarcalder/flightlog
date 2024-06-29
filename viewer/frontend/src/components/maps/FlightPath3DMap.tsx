import { PropsWithChildren, useMemo } from 'react'
import DeckGL from '@deck.gl/react'
import { TerrainLayer } from '@deck.gl/geo-layers'
import { Position } from '../../types'
import { generatePathData, generatePathLayer } from './helpers'

const TERRAIN_IMAGE = `https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.png?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`
const SURFACE_IMAGE = `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.png?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`
const ELEVATION_DECODER = {
  rScaler: 6553.6,
  gScaler: 25.6,
  bScaler: 0.1,
  offset: -10000
}

interface MapProps {
  positionLogs: Position[]
  showPathLayer?: boolean
  pathWidth?: number
}

const FlightPath3DMap = (props: PropsWithChildren<MapProps>) => {
  const pathData = useMemo<number[][]>(
    () => generatePathData({ positionLogs: props.positionLogs }),
    [props.positionLogs]
  )

  const pathLayer = useMemo(
    () =>
      generatePathLayer({
        pathData,
        visible: props.showPathLayer,
        width: props.pathWidth
      }),
    [pathData, props.showPathLayer, props.pathWidth]
  )

  const initialViewState = useMemo(
    () => ({
      latitude: props.positionLogs.length > 0 ? pathData[0][1] : -39.28154,
      longitude: props.positionLogs.length > 0 ? pathData[0][0] : 175.564541,
      zoom: 11.5,
      bearing: 140,
      pitch: 60,
      maxPitch: 70
    }),
    [pathData]
  )

  const terrainLayer = new TerrainLayer({
    id: 'terrainlayer',
    minZoom: 0,
    maxZoom: 23,
    elevationDecoder: ELEVATION_DECODER,
    elevationData: TERRAIN_IMAGE,
    texture: SURFACE_IMAGE,
    wireframe: false,
    color: [255, 255, 255]
  })

  return (
    <DeckGL
      initialViewState={initialViewState}
      controller={true}
      layers={[terrainLayer, pathLayer]}
    >
      {props.children}
    </DeckGL>
  )
}

export default FlightPath3DMap
