import { makeAutoObservable, observable, action } from 'mobx';
import { Site, Glider, Flight} from './lib/types'

class Store {
    accessToken: string|null = null

    constructor() {
        makeAutoObservable(this, {
            accessToken: observable,
            setAccessToken: action
        })
    }

    setAccessToken(newAccessToken: string) {
        this.accessToken = newAccessToken
    }
}

export default Store
