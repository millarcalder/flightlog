import { useContext, FC } from 'react'
import { observer } from 'mobx-react-lite'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import { StoreContext } from '../index'

interface IProps {
    setSelectedSite: Function
}

const SitesList: FC<IProps> = observer(({ setSelectedSite }) => {
    const store = useContext(StoreContext)

    return <ListGroup>
        {store.sites.map(site =>
            <ListGroupItem key={site.id} onClick={() => setSelectedSite(site)}>
                {site.name}{site.flights ? ` - flights: ${site.flights.length}` : ''}
            </ListGroupItem>
        )}
    </ListGroup>
})

export default SitesList;
