import { useContext, FC, useState, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { Form, ListGroup, ListGroupItem, InputGroup } from 'react-bootstrap'
import { StoreContext } from '../index'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare, faSearch } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { Site } from '../lib/types'
import Fuse from 'fuse.js'

interface IProps {
  onClick: (site: Site) => void
}

const SitesList: FC<IProps> = observer(({ onClick }) => {
  const store = useContext(StoreContext)
  const [searchPattern, setSearchPattern] = useState<string>("")

  const results = useMemo(() => {
    if (searchPattern.length === 0) return store.sites
    const fuse = new Fuse(store.sites, {
      keys: [
        "name",
        "country"
      ]
    })
    return fuse.search(searchPattern).map((val) => val.item)
  }, [store.sites, searchPattern])

  return <>
    <ListGroup>
      <ListGroupItem className='p-0'>
        <InputGroup>
          <Form.Control name="search" type='search' placeholder='Search...' className='border-0' onChange={(e) => {
            setSearchPattern(e.target.value)
          }} />
          <InputGroup.Text className='border-0'>
            <FontAwesomeIcon icon={faSearch} />
          </InputGroup.Text>
        </InputGroup>
      </ListGroupItem>
      {results.slice(0, 10).map((site) => (
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
  </>
})

export default SitesList
