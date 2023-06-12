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
  settings: {
    layers: {
      path: boolean
      heatMap: boolean
    }
    pathWidth: number
  }
}

const initialState: MainState = {
  loading: false,
  view: 'terrain',
  settings: {
    layers: {
      path: true,
      heatMap: true
    },
    pathWidth: 10
  }
}

interface ShowMapLayerPayload {
  layer: 'path' | 'heatMap'
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
      state.settings.layers[action.payload.layer] = action.payload.show
    },
    setPathWidth: (state, action: PayloadAction<number>) => {
      state.settings.pathWidth = action.payload
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
  showMapLayer,
  setPathWidth
} = mainSlice.actions

export default mainSlice.reducer
