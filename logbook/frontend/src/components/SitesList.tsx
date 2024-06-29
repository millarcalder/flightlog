import { useContext, FC } from 'react'
import { observer } from 'mobx-react-lite'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import { StoreContext } from '../index'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { Site } from '../lib/types'

interface IProps {
  onClick: (site: Site) => void
}

const SitesList: FC<IProps> = observer(({ onClick }) => {
  const store = useContext(StoreContext)

  return (
    <ListGroup>
      {store.sites.map((site) => (
        <ListGroupItem action key={site.id} onClick={() => onClick(site)}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <span>
              {site.name}
              {site.flights ? ` - flights: ${site.flights.length}` : ''}
            </span>
            <Link to={`/site/${site.id}`}>
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </Link>
          </div>
        </ListGroupItem>
      ))}
    </ListGroup>
  )
})

export default SitesList
