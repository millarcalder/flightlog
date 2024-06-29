import { useRef, useEffect, FC, useMemo } from 'react'
import Map, { Marker, MapRef } from 'react-map-gl'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationPin } from '@fortawesome/free-solid-svg-icons'
import { Site } from '../lib/types'

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
  const mapRef = useRef<MapRef>()

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
        // @ts-ignore
        ref={mapRef}
        initialViewState={initialState}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        style={{ width: width, height: height, borderRadius: 10 }}
      >
        {sites.map((site) => (
          <Marker
            key={site.id}
            longitude={site.longitude}
            latitude={site.latitude}
            anchor="bottom"
          >
            <FontAwesomeIcon icon={faLocationPin} />
          </Marker>
        ))}
      </Map>
    </>
  )
}

export default SitesMap
