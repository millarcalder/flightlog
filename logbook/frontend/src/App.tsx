import './App.css'
import { Spinner, Modal } from 'react-bootstrap'
import { useContext, PropsWithChildren, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { StoreContext } from './index'
import FlightForm from './components/forms/FlightForm'
import GliderForm from './components/forms/GliderForm'
import SiteForm from './components/forms/SiteForm'
import Home from './pages/Home'
import Login from './pages/Login'
import Site from './pages/Site'
import NavBar from './NavBar'
import queries from './lib/queries'

const LoadingOverlay = () => (
  <div
    style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      alignContent: 'center',
      zIndex: 1000,
      backgroundColor: 'rgba(0, 0, 0, 0.2)'
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Spinner />
    </div>
  </div>
)

const Layout = observer((props: PropsWithChildren) => {
  const store = useContext(StoreContext)

  return (
    <>
      {store.loading ? <LoadingOverlay /> : null}
      <header>
        <NavBar />
      </header>
      {store.addEntityModal ? (
        <Modal
          show={!store.loading}
          onHide={() => {
            store.clearAddEntityModal()
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add {store.addEntityModal}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {store.addEntityModal == 'Flight' ? (
              <FlightForm
                sites={store.sites}
                gliders={store.gliders}
                onSubmit={(data) => {
                  queries.addFlight(store.accessToken!, data).then((flight) => {
                    store.addFlight(flight)
                  })
                }}
              />
            ) : store.addEntityModal == 'Glider' ? (
              <GliderForm onSubmit={(data) => {
                queries.addGlider(store.accessToken!, data).then((glider) => {
                  store.addGlider(glider)
                })
              }} />
            ) : store.addEntityModal == 'Site' ? (
              <SiteForm onSubmit={(data) => {
                queries.addSite(store.accessToken!, data).then((site) => {
                  store.addSite(site)
                })
              }} />
            ) : null}
          </Modal.Body>
        </Modal>
      ) : null}
      {props.children}
    </>
  )
})

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Home />
      </Layout>
    )
  },
  {
    path: '/foo',
    element: <Layout>bar</Layout>
  },
  {
    path: '/site/:id',
    element: (
      <Layout>
        <Site />
      </Layout>
    )
  },
  {
    path: '/login',
    element: (
      <Layout>
        <Login />
      </Layout>
    )
  }
])

const App = observer(() => {
  // The user should be logged in before accessing any pages in this application
  const store = useContext(StoreContext)

  useEffect(() => {
    if (store.accessToken) {
      store.setLoading(true)
      Promise.all([
        queries.fetchSites(store.accessToken).then((newSites) => {
          store.setSites(newSites)
        }),
        queries.fetchGliders(store.accessToken).then((newGliders) => {
          store.setGliders(newGliders)
        })
      ]).then(() => {
        store.setLoading(false)
      })
    }
  }, [store.accessToken])

  if (!store.accessToken) return <Login />

  return <RouterProvider router={router} />
})

export default App
