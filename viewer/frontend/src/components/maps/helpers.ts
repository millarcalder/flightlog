import { HeatmapLayer } from '@deck.gl/aggregation-layers'
import MultiColorPathLayer from '../custom_deckgl_layers/multicolor_path_layer/layer'
import { Position } from '../../types'
import MobileDetect from 'mobile-detect'

export const generateHeatMapData = (positionLogs: Position[]): number[][] => {
  const res = []
  for (let i = 1; i < positionLogs.length; i++) {
    const pos = positionLogs[i]
    const prev_pos = positionLogs[i - 1]
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
    visible
  })

interface GeneratePathDataProps {
  positionLogs: Position[]
  flat?: boolean
}

export const generatePathData = ({
  positionLogs,
  flat = false
}: GeneratePathDataProps): number[][] => {
  const path_arr: number[][] = []
  for (let i = 1; i < positionLogs.length; i++) {
    path_arr.push([
      positionLogs[i].longitude,
      positionLogs[i].latitude,
      flat ? 0 : positionLogs[i].altitude
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
  width = 4,
  visible = true
}: generatePathLayerProps): MultiColorPathLayer => {
  const md = new MobileDetect(navigator.userAgent)
  return new MultiColorPathLayer({
    id: 'pathlayer',
    data: [
      {
        path: pathData
      }
    ],
    getWidth: () => width,
    // @ts-expect-error I'm not sure why I needed this..
    getColor: () => {
      return pathData.map((p) => {
        const r = p[2] / 1000
        return [255 * r, 0, 255, 255]
      })
    },
    capRounded: true,
    jointRounded: true,
    // billboard breaks on mobile devices and the path is not visible, so for now lets disable this on mobile
    billboard: !md.mobile(),
    visible
  })
}
