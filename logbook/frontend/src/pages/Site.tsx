import { FC, useEffect, useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { StoreContext } from '../index'
import { Site } from '../lib/types'
import SitesMap from '../components/SitesMap'
import FlightsTable from '../components/FlightsTable'
import { Alert, Container, Row, Col, Table } from 'react-bootstrap'
import queries from '../lib/queries'

const SiteComponent: FC<{ site: Site }> = ({ site }) => {
  return (
    <Container>
      <Row>
        <Col className="m-0 p-0">
          <SitesMap sites={[site]} width="100%" height={300} />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Table striped bordered hover>
            <tbody>
              <tr>
                <th>Name</th>
                <td>{site.name}</td>
              </tr>
              <tr>
                <th>Description</th>
                <td>{site.description}</td>
              </tr>
              <tr>
                <th>Altitude</th>
                <td>{site.altitude}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col>
          <div style={{ maxHeight: 400, overflow: 'scroll' }}>
            <FlightsTable flights={site.flights ? site.flights : []} />
          </div>
        </Col>
      </Row>
    </Container>
  )
}

const SitePage = observer(() => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [site, setSite] = useState<Site | null>(null)

  const { id } = useParams()
  const store = useContext(StoreContext)

  useEffect(() => {
    /* Try to fetch the site from the store, otherwise provide the user with an error message */

    // The store is loading
    if (store.loading) {
      setErrorMessage(null)
      setSite(null)
      return
    }

    // Site ID not provided
    if (id === undefined) {
      setErrorMessage('Site ID not provided')
      setSite(null)
      return
    }

    const siteId = Number(id)

    // Invalid site ID
    if (!Number.isInteger(siteId)) {
      setErrorMessage('Invalid Site ID provided')
      setSite(null)
      return
    }

    const site = store.getSite(siteId)

    // Site not found
    if (site === undefined) {
      setErrorMessage('Site not found')
      setSite(null)
      return
    }

    // Success!
    setErrorMessage(null)
    setSite(site)

    // Load the flights if they are not already initialized
    if (!site.flights) {
      store.setLoading(true)
      queries.fetchSiteFlights(store.accessToken!, site.id).then((flights) => {
        store.setSiteFlights(site, flights)
        store.setLoading(false)
      })
    }
  }, [id, store.loading, store.sites])

  return errorMessage ? (
    <Alert variant="danger">{errorMessage}</Alert>
  ) : site ? (
    <SiteComponent site={site} />
  ) : null
})

export default SitePage
