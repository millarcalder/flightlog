import React, { PropsWithChildren, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleInfo,
  faRepeat,
  faCog,
  faUpload,
  faShare
} from '@fortawesome/free-solid-svg-icons'
import AltitudeGraph from './components/graphs/AltitudeGraph'
import FlightPath3DMap from './components/maps/FlightPath3DMap'
import HeatMap from './components/maps/HeatMap'
import FlightLogInfoModal from './modals/FlightLogInfoModal'
import SettingsModal from './modals/SettingsModal'
import UploadIgcFileModal, { ShareModal } from './modals/UploadIgcFileModal'
import { useAppSelector, useAppDispatch } from './store/hooks'
import {
  setLoading,
  setFlightlog,
  clearFlightlog,
  setView,
  showModal,
  clearModal
} from './store/mainReducer'

window.addEventListener('contextmenu', (e) => e.preventDefault())

const LoadingSpinner = () => {
  const loading = useAppSelector((state) => state.main.loading)

  return loading ? (
    <div
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Spinner animation="grow" variant="dark" />
    </div>
  ) : null
}

const AppOverlay = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const flightlog = useAppSelector((state) => state.main.flightlog)
  const flightlogFile = useAppSelector((state) => state.main.flightlogFile)
  const view = useAppSelector((state) => state.main.view)

  const handleSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    dispatch(setLoading(true))

    let file = e.target.files[0]
    let formdata = new FormData()
    formdata.append('igc', file)

    fetch(`${process.env.REACT_APP_FLIGHTLOG_API_URL}extract-flight-log/file`, {
      method: 'POST',
      body: formdata
    })
      .then((resp) => resp.json())
      .then((result) => {
        file.text().then((str) => {
          dispatch(
            setFlightlog({
              flightlog: result,
              flightlogFile: str
            })
          )
          navigate('/')
        })
      })
      .catch((err) => {
        dispatch(clearFlightlog())
        navigate('/')
      })
      .finally(() => {
        dispatch(setLoading(false))
      })
  }

  return (
    <>
      <LoadingSpinner />
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Form.Control
            type="file"
            onChange={handleSubmit}
            style={{
              margin: 10,
              width: 'auto'
            }}
          />
          <div>
            {flightlogFile ? (
              <FontAwesomeIcon
                icon={faUpload}
                size="3x"
                inverse
                className="icon-button"
                style={{
                  margin: 10
                }}
                onClick={() => {
                  dispatch(showModal('uploadIgcFile'))
                }}
              />
            ) : flightlog ? (
              <FontAwesomeIcon
                icon={faShare}
                size="3x"
                inverse
                className="icon-button"
                style={{
                  margin: 10
                }}
                onClick={() => {
                  dispatch(showModal('share'))
                }}
              />
            ) : null}
            <FontAwesomeIcon
              icon={faRepeat}
              size="3x"
              inverse
              className="icon-button"
              style={{
                margin: 10
              }}
              onClick={() => {
                dispatch(setView(view == 'terrain' ? 'satallite' : 'terrain'))
              }}
            />
            <FontAwesomeIcon
              icon={faCog}
              size="3x"
              inverse
              className="icon-button"
              style={{
                margin: 10
              }}
              onClick={() => {
                dispatch(showModal('settings'))
              }}
            />
            <FontAwesomeIcon
              icon={faCircleInfo}
              size="3x"
              inverse
              className="icon-button"
              style={{
                margin: 10
              }}
              onClick={() => {
                dispatch(showModal('flightlogInfo'))
              }}
            />
          </div>
        </div>
        <AltitudeGraph
          data={flightlog ? flightlog.position_logs : []}
          style={{ margin: 10 }}
        />
      </div>
    </>
  )
}

const ComponentSelector = (props: PropsWithChildren<any>) => {
  const flightlog = useAppSelector((state) => state.main.flightlog)
  const view = useAppSelector((state) => state.main.view)
  const showPathLayer = useAppSelector(
    (state) => state.main.settings.layers.path
  )
  const showHeatMapLayer = useAppSelector(
    (state) => state.main.settings.layers.heatMap
  )
  const pathWidth = useAppSelector((state) => state.main.settings.pathWidth)

  const positionLogs = useMemo(
    () => (flightlog ? flightlog.position_logs : []),
    [flightlog]
  )

  return view === 'terrain' ? (
    <FlightPath3DMap positionLogs={positionLogs} showPathLayer={showPathLayer} pathWidth={pathWidth}>
      {props.children}
    </FlightPath3DMap>
  ) : view === 'satallite' ? (
    <HeatMap
      positionLogs={positionLogs}
      showPathLayer={showPathLayer}
      showHeatMapLayer={showHeatMapLayer}
    >
      {props.children}
    </HeatMap>
  ) : (
    <div>{props.children}</div>
  )
}

const Modals = () => {
  const dispatch = useAppDispatch()
  const flightlog = useAppSelector((state) => state.main.flightlog)
  const modal = useAppSelector((state) => state.main.modal)

  const handleClose = () => {
    dispatch(clearModal())
  }

  return (
    <>
      {flightlog !== undefined ? (
        <FlightLogInfoModal
          show={modal == 'flightlogInfo' && flightlog !== undefined}
          handleClose={handleClose}
          flightlog={flightlog}
        />
      ) : null}
      <SettingsModal show={modal == 'settings'} handleClose={handleClose} />
      <UploadIgcFileModal
        show={modal == 'uploadIgcFile'}
        handleClose={handleClose}
      />
      <ShareModal show={modal == 'share'} handleClose={handleClose} />
    </>
  )
}

const App = () => {
  const dispatch = useAppDispatch()
  const { s3Object } = useParams()

  useEffect(() => {
    /**
     * When the S3 object URL parameter changes reload the flightlog
     */
    if (s3Object !== undefined) {
      dispatch(setLoading(true))
      fetch(
        `${process.env.REACT_APP_FLIGHTLOG_API_URL}extract-flight-log/s3/${s3Object}`
      )
        .then((resp) => resp.json())
        .then((result) => {
          dispatch(
            setFlightlog({
              flightlog: result
            })
          )
        })
        .catch((err) => {
          dispatch(clearFlightlog())
        })
        .finally(() => {
          dispatch(setLoading(false))
        })
    } else {
      // If there is no S3 object then clear the flightlog
      dispatch(clearFlightlog())
    }
  }, [s3Object])

  return (
    <div className="App">
      <div>
        <ComponentSelector>
          <AppOverlay />
        </ComponentSelector>
      </div>
      <Modals />
    </div>
  )
}

export default App
