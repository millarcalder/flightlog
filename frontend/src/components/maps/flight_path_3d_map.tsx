import { PropsWithChildren, useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import MultiColorPathLayer from '../custom_deckgl_layers/multicolor_path_layer/layer';
import { TerrainLayer } from '@deck.gl/geo-layers';
import { Position } from '../../types';

const TERRAIN_IMAGE = `https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.png?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`;
const SURFACE_IMAGE = `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.png?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`;
const ELEVATION_DECODER = {
  rScaler: 6553.6,
  gScaler: 25.6,
  bScaler: 0.1,
  offset: -10000
};

interface MapProps {
  position_logs: Position[]
}

const FlightPath3DMap = (props: PropsWithChildren<MapProps>) => {
  const path = useMemo<number[][]>(() => {
    let path_arr: number[][] = [];
    for (let i=1; i<props.position_logs.length; i++) {
      path_arr.push([props.position_logs[i].longitude, props.position_logs[i].latitude, props.position_logs[i].altitude]);
    }
    return path_arr
  }, [props.position_logs]);

  const terrainlayer = new TerrainLayer({
    id: 'terrainlayer',
    minZoom: 0,
    maxZoom: 23,
    elevationDecoder: ELEVATION_DECODER,
    elevationData: TERRAIN_IMAGE,
    texture: SURFACE_IMAGE,
    wireframe: false,
    color: [255, 255, 255]
  });

  const linelayer = useMemo<any>(() => {
    if (props.position_logs.length > 0) {
      // @ts-ignore
      return new MultiColorPathLayer({
        id: 'pathlayer',
        data: [{
          path
        }],
        getWidth: () => 10,
        // @ts-ignore
        getColor: () => {
          return path.map((p) => {
            const r = p[2] / 1000;
            return [255 * r, 0, 255, 255];
          });
        },
        capRounded: true,
        jointRounded: true,
        billboard: true
      });
    }
  }, [props.position_logs]);

  const layers = useMemo<Array<any>>(() => {
    let res = [terrainlayer];
    if (linelayer) res.push(linelayer);
    return res;
  }, [linelayer]);

  return <DeckGL
    initialViewState={{
      latitude: props.position_logs.length > 0 ? path[0][1] : -39.281540,
      longitude: props.position_logs.length > 0 ? path[0][0] : 175.564541,
      zoom: 11.5,
      bearing: 140,
      pitch: 60,
      maxPitch: 89
    }}
    controller={true}
    layers={layers}
  >
    {props.children}
  </DeckGL>;
}

export default FlightPath3DMap;
