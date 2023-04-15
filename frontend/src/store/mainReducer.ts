import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FlightLog } from '../types'

type MapView = 'terrain' | 'satallite'

interface MainState {
  loading: boolean
  flightlog?: FlightLog
  view: MapView
  modals: {
    flightlogInfo: boolean
    settings: boolean
  }
  mapLayers: {
    pathLayer: boolean
    heatMapLayer: boolean
  }
}

const initialState: MainState = {
  loading: false,
  flightlog: undefined,
  view: 'terrain',
  modals: {
    flightlogInfo: false,
    settings: false
  },
  mapLayers: {
    pathLayer: true,
    heatMapLayer: true
  }
}

interface ShowModalPayload {
  modal: 'flightlogInfo' | 'settings'
  show: boolean
}

interface ShowMapLayerPayload {
  layer: 'pathLayer' | 'heatMapLayer'
  show: boolean
}

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setFlightlog: (state, action: PayloadAction<FlightLog>) => {
      state.flightlog = action.payload
    },
    clearFlightlog: (state) => {
      state.flightlog = undefined
    },
    setView: (state, action: PayloadAction<MapView>) => {
      state.view = action.payload
    },
    showModal: (state, action: PayloadAction<ShowModalPayload>) => {
      state.modals[action.payload.modal] = action.payload.show
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
  showMapLayer
} = mainSlice.actions

export default mainSlice.reducer
