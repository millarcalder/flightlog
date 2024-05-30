export interface IAuthentication {
  authenticate(email: string, password: string): Promise<string>
}

class MockedAuthentication implements IAuthentication {
  authenticate(email: string, password: string) {
    return new Promise<string>((resolve, reject) => {
      setTimeout(() => {
        console.log('Mocked authentication request!')
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
    return fetch(process.env.REACT_APP_AUTH_URL!, {
      method: 'POST',
      body: formdata
    })
      .then((res: any) => {
        if (res.ok) return res.json()
      })
      .then((token: any) => {
        return token.access_token
      })
  }
}

const authentication = process.env.REACT_APP_AUTH_URL
  ? new Authentication()
  : new MockedAuthentication()
export default authentication
