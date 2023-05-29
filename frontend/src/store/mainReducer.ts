import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FlightLog } from '../types'

type MapView = 'terrain' | 'satallite'
type Modal = 'flightlogInfo' | 'settings' | 'uploadIgcFile' | 'share'

interface MainState {
  loading: boolean
  flightlog?: FlightLog
  flightlogFile?: string
  view: MapView
  modal?: Modal
  mapLayers: {
    pathLayer: boolean
    heatMapLayer: boolean
  }
}

const initialState: MainState = {
  loading: false,
  view: 'terrain',
  mapLayers: {
    pathLayer: true,
    heatMapLayer: true
  }
}

interface ShowMapLayerPayload {
  layer: 'pathLayer' | 'heatMapLayer'
  show: boolean
}

interface SetFlightlogPayload {
  flightlog: FlightLog
  flightlogFile?: string
}

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setFlightlog: (state, action: PayloadAction<SetFlightlogPayload>) => {
      state.flightlog = action.payload.flightlog
      state.flightlogFile = action.payload.flightlogFile
    },
    clearFlightlog: (state) => {
      state.flightlog = undefined
      state.flightlogFile = undefined
    },
    setView: (state, action: PayloadAction<MapView>) => {
      state.view = action.payload
    },
    showModal: (state, action: PayloadAction<Modal>) => {
      state.modal = action.payload
    },
    clearModal: (state) => {
      state.modal = undefined
    },
    showMapLayer: (state, action: PayloadAction<ShowMapLayerPayload>) => {
      state.mapLayers[action.payload.layer] = action.payload.show
    }
  }
})

export const {
  setLoading,
  setFlightlog,
  clearFlightlog,
  setView,
  showModal,
  clearModal,
  showMapLayer
} = mainSlice.actions

export default mainSlice.reducer
