import { makeAutoObservable, observable, action } from 'mobx';
import { Site} from './lib/types'

class Store {
    accessToken: string|null = null
    sites: Site[] = []

    constructor() {
        makeAutoObservable(this, {
            accessToken: observable,
            setAccessToken: action
        })
    }

    setAccessToken(newAccessToken: string) {
        this.accessToken = newAccessToken
    }

    setSites(newSites: Site[]) {
        this.sites = newSites
    }
}

export default Store
