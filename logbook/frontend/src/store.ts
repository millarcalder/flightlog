import { makeAutoObservable, observable, action } from 'mobx'
import { Glider, Site } from './lib/types'

type AddEntityModal = 'Flight' | 'Glider' | 'Site'

class Store {
  addEntityModal?: AddEntityModal
  accessToken: string | null = null
  loading: boolean = false

  sites: Site[] = []
  gliders: Glider[] = []

  constructor() {
    makeAutoObservable(this, {
      accessToken: observable,
      setAccessToken: action
    })
  }

  setLoading(isLoading: boolean) {
    this.loading = isLoading
  }

  setAccessToken(newAccessToken: string) {
    this.accessToken = newAccessToken
  }

  setSites(newSites: Site[]) {
    this.sites = newSites
  }

  getSite(id: number) {
    return this.sites.find((site) => site.id == id)
  }

  setGliders(newGliders: Glider[]) {
    this.gliders = newGliders
  }

  setAddEntityModal(addEntityModal: AddEntityModal) {
    this.addEntityModal = addEntityModal
  }

  clearAddEntityModal() {
    this.addEntityModal = undefined
  }
}

export default Store
