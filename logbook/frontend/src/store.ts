import { makeAutoObservable, observable, action } from 'mobx';
import { Site} from './lib/types'

class Store {
    accessToken: string|null = null
    loading: boolean = false
    sites: Site[] = []

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
        return this.sites.find(site => site.id == id)
    }
}

export default Store
