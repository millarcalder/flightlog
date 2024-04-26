import { useRef, useEffect, FC } from 'react'
import Map, { Marker, MapRef } from 'react-map-gl'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationPin } from '@fortawesome/free-solid-svg-icons'
import { Site } from '../lib/types'

interface IProps {
    sites: Site[]
    selectedSite?: Site
}

const SitesMap: FC<IProps> = ({ sites, selectedSite }) => {
    const mapRef = useRef<MapRef>();

    const moveSite = (lat: number, lng: number) => {
        mapRef.current?.flyTo({center: [lat, lng], duration: 2000});
    }

    useEffect(() => {
        if (selectedSite) {
            moveSite(selectedSite.longitude, selectedSite.latitude)
        } else if (sites.length > 0) {
            moveSite(sites[0].longitude, sites[0].latitude)
        }
    }, [selectedSite, sites])

    return <>
        <Map
            // @ts-ignore
            ref={mapRef}
            initialViewState={{
                latitude: -40,
                longitude: 173,
                zoom: 3.5
            }}
            mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            style={{width: 600, height: 600, borderRadius: 10}}
        >
            {sites.map((site) => 
                <Marker key={site.id} longitude={site.longitude} latitude={site.latitude} anchor="bottom" >
                    <FontAwesomeIcon icon={faLocationPin} />
                </Marker>
            )}
        </Map>
    </>
}

export default SitesMap
