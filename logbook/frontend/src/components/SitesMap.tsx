import { useRef, useEffect, FC, useMemo } from 'react'
import Map, { Source, Layer } from 'react-map-gl'
import type { MapRef } from 'react-map-gl'
import pin from '../pin.svg'
import { Site } from '../lib/types'
import type { LayerProps } from 'react-map-gl'

export const clusterLayer: LayerProps = {
  id: 'clusters',
  type: 'circle',
  source: 'sites',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': '#000000',
    'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
  }
}

export const clusterCountLayer: LayerProps = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'sites',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12
  },
  paint: {
    'text-color': '#ffffff'
  }
}

export const unclusteredPointLayer: LayerProps = {
  id: 'unclustered-point',
  type: 'symbol',
  source: 'sites',
  filter: ['!', ['has', 'point_count']],
  layout: {
    'icon-image': 'marker'
  },
  paint: {
    'icon-color': '#000000'
  }
}

interface IProps {
  sites: Site[]
  selectedSite?: Site
  height?: number | string
  width?: number | string
}

const SitesMap: FC<IProps> = ({
  sites,
  selectedSite,
  height = 500,
  width = 500
}) => {
  const mapRef = useRef<MapRef>(null)

  const moveSite = (lat: number, lng: number) => {
    mapRef.current?.flyTo({ center: [lat, lng], duration: 2000 })
  }

  const initialState = useMemo(() => {
    if (selectedSite) {
      return {
        longitude: selectedSite.longitude,
        latitude: selectedSite.latitude,
        zoom: 3.5
      }
    } else if (sites.length > 0) {
      return {
        longitude: sites[0].longitude,
        latitude: sites[0].latitude,
        zoom: 3.5
      }
    }
  }, [sites, selectedSite])

  useEffect(() => {
    if (selectedSite) {
      moveSite(selectedSite.longitude, selectedSite.latitude)
    } else if (sites.length > 0) {
      moveSite(sites[0].longitude, sites[0].latitude)
    }
  }, [selectedSite, sites])

  return (
    <>
      <Map
        ref={mapRef}
        initialViewState={initialState}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        style={{ width: width, height: height, borderRadius: 10 }}
        onLoad={() => {
          mapRef.current?.on('styleimagemissing', () => {
            // Took me a long time to figure out how to use an SVG, in the end this github issue provided a soution:
            // https://github.com/visgl/react-map-gl/issues/1118#issuecomment-1419166037
            const img = new Image(15, 15)
            img.src = pin
            img.onload = () => {
              mapRef.current?.addImage('marker', img, { sdf: true })
            }
          })
        }}
      >
        <Source
          id="sites"
          type="geojson"
          data={{
            type: 'FeatureCollection',
            features: sites.map((site) => ({
              type: 'Feature',
              properties: {
                id: site.id,
                name: site.name,
                latitude: site.latitude,
                longitude: site.longitude
              },
              geometry: {
                type: 'Point',
                coordinates: [site.longitude, site.latitude]
              }
            }))
          }}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source>
      </Map>
    </>
  )
}

export default SitesMap
