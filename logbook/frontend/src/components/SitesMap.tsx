import { useEffect, useState } from 'react'
import Map, { Marker } from 'react-map-gl'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationPin } from '@fortawesome/free-solid-svg-icons'
import { Site } from '../lib/types'
import queries from '../lib/queries'

const SitesMap = () => {
    const [sites, setSites] = useState<Site[]>([])

    useEffect(() => {
        queries.fetchSites().then((res) => {
            setSites(res)
        })
    }, [])

    return (
        <Map
            mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
            initialViewState={{
                longitude: -100,
                latitude: 40,
                zoom: 3.5
            }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            style={{width: 600, height: 600, borderRadius: 10}}
        >
            {sites.map((site) => 
                <Marker key={site.id} longitude={site.longitude} latitude={site.latitude} anchor="bottom" >
                    <FontAwesomeIcon icon={faLocationPin} />
                </Marker>
            )}
        </Map>
    )
}

export default SitesMap
