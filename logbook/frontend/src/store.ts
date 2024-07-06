import { makeAutoObservable, observable, action } from 'mobx'
import { Flight, Glider, Site } from './lib/types'
import { deepClone } from './lib/helpers'

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

  addSite(newSite: Site) {
    this.sites.push(newSite)
  }

  addFlight(flight: Flight) {
    /*
      Need to make a deep clone of the site and then reassign the entire sites list
      for all observers to catch the event.
    */
    const i = this.sites.findIndex((site) => site.id === flight.siteId)
    if (i < 0) throw Error('Site not found!')

    const clone = deepClone(this.sites[i])
    if (!clone.flights) clone.flights = []
    clone.flights!.push(flight)

    this.sites = this.sites.map((site) => (site.id === clone.id ? clone : site))
  }

  getSite(id: number) {
    return this.sites.find((site) => site.id === id)
  }

  setGliders(newGliders: Glider[]) {
    this.gliders = newGliders
  }

  addGlider(newGlider: Glider) {
    this.gliders.push(newGlider)
  }

  getGlider(id: number) {
    return this.gliders.find((glider) => glider.id === id)
  }

  setAddEntityModal(addEntityModal: AddEntityModal) {
    this.addEntityModal = addEntityModal
  }

  clearAddEntityModal() {
    this.addEntityModal = undefined
  }
}

export default Store
