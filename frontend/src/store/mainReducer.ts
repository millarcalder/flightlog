import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FlightLog } from '../types'

type MapView = 'terrain' | 'satallite'

interface MainState {
  loading: boolean
  flightlog?: FlightLog

  // TODO: redux doesn't like storing this, need to use something serializable
  flightlogFormData?: FormData
  view: MapView
  modals: {
    flightlogInfo: boolean
    settings: boolean
    uploadIgcFile: boolean
    share: boolean
  }
  mapLayers: {
    pathLayer: boolean
    heatMapLayer: boolean
  }
}

const initialState: MainState = {
  loading: false,
  view: 'terrain',
  modals: {
    flightlogInfo: false,
    settings: false,
    uploadIgcFile: false,
    share: false
  },
  mapLayers: {
    pathLayer: true,
    heatMapLayer: true
  }
}

interface ShowModalPayload {
  modal: 'flightlogInfo' | 'settings' | 'uploadIgcFile' | 'share'
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
    setFlightlogFormData: (state, action: PayloadAction<FormData>) => {
      state.flightlogFormData = action.payload
    },
    clearFlightlogFormData: (state) => {
      state.flightlogFormData = undefined
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
  setFlightlogFormData,
  clearFlightlogFormData,
  setFlightlog,
  clearFlightlog,
  setView,
  showModal,
  showMapLayer
} = mainSlice.actions

export default mainSlice.reducer
