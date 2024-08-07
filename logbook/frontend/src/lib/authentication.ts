export interface IAuthentication {
  authenticate(email: string, password: string): Promise<string>
}

class MockedAuthentication implements IAuthentication {
  authenticate(email: string, password: string) {
    return new Promise<string>((resolve, reject) => {
      setTimeout(() => {
        console.log('Mocked method: IAuthentication.authenticate')
        if (password === 'enter') resolve('imatoken')
        reject('You shall not pass!')
      }, 1000)
    })
  }
}

class Authentication implements IAuthentication {
  authenticate(email: string, password: string) {
    const formdata = new FormData()
    formdata.append('username', email)
    formdata.append('password', password)
    return fetch(`${process.env.REACT_APP_LOGBOOK_API}/token`, {
      method: 'POST',
      body: formdata
    })
      .then((res: Response) => {
        if (res.ok) return res.json()
      })
      .then((token) => {
        return token.access_token
      })
  }
}

const authentication = process.env.REACT_APP_MOCK_QUERIES
  ? new MockedAuthentication()
  : new Authentication()
export default authentication
