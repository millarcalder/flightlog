import { HeatmapLayer } from '@deck.gl/aggregation-layers'
import MultiColorPathLayer from '../custom_deckgl_layers/multicolor_path_layer/layer'
import { Position } from '../../types'

export const generateHeatMapData = (positionLogs: Position[]): number[][] => {
  let res = []
  for (let i = 1; i < positionLogs.length; i++) {
    let pos = positionLogs[i]
    let prev_pos = positionLogs[i - 1]
    res.push([pos.longitude, pos.latitude, pos.altitude - prev_pos.altitude])
  }
  return res
}

export const generateHeatMapLayer = (
  heatMapData: number[][],
  visible: boolean = true
) =>
  new HeatmapLayer({
    data: heatMapData,
    id: 'heatmp-layer',
    pickable: false,
    getPosition: (d) => [d[0], d[1]],
    getWeight: (d) => d[2],
    radiusPixels: 30,
    intensity: 1,
    threshold: 0.03,
    visible,
  })


interface GeneratePathDataProps {
  positionLogs: Position[]
  flat?: boolean
}

export const generatePathData = ({
  positionLogs,
  flat = false
}: GeneratePathDataProps): number[][] => {
  let path_arr: number[][] = []
  for (let i = 1; i < positionLogs.length; i++) {
    path_arr.push([
      positionLogs[i].longitude,
      positionLogs[i].latitude,
      flat ? 0 : positionLogs[i].altitude,
    ])
  }
  return path_arr
}

interface generatePathLayerProps {
  pathData: number[][]
  width?: number
  visible?: boolean
}

export const generatePathLayer = ({
  pathData,
  width = 10,
  visible = true,
}: generatePathLayerProps): MultiColorPathLayer => {
  return new MultiColorPathLayer({
    id: 'pathlayer',
    data: [
      {
        path: pathData,
      },
    ],
    getWidth: () => width,
    // @ts-ignore
    getColor: () => {
      return pathData.map((p) => {
        const r = p[2] / 1000
        return [255 * r, 0, 255, 255]
      })
    },
    capRounded: true,
    jointRounded: true,
    billboard: true,
    visible,
  })
}
