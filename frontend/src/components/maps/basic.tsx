import DeckGL from '@deck.gl/react';
import { LineLayer } from '@deck.gl/layers'
import { TerrainLayer } from '@deck.gl/geo-layers';
import { PropsWithChildren, useMemo } from 'react';

const TERRAIN_IMAGE = `https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.png?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`;
const SURFACE_IMAGE = `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.png?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`;
const ELEVATION_DECODER = {
  rScaler: 6553.6,
  gScaler: 25.6,
  bScaler: 0.1,
  offset: -10000
};

interface TestMapProps {
  data: Array<{
    sourcePosition: Array<number>,
    targetPosition: Array<number>
  }>
}

const TestMap = (props: PropsWithChildren<TestMapProps>) => {
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
    if (props.data.length > 0) {
      return new LineLayer({
        id: 'linelayer',
        data: props.data,
        getWidth: () => 5,
        getColor: (d: any) => {
          const r = d.sourcePosition[2] / 1000;
          return [255 * r, 0, 255, 255];
        }
      });
    }
  }, [props.data]);

  const layers = useMemo<Array<any>>(() => {
    let res = [terrainlayer];
    if (linelayer) res.push(linelayer);
    return res;
  }, [linelayer]);

  return <DeckGL
    initialViewState={{
      latitude: props.data.length > 0 ? props.data[0].sourcePosition[1] : -39.281540,
      longitude: props.data.length > 0 ? props.data[0].sourcePosition[0] : 175.564541,
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

export default TestMap;
