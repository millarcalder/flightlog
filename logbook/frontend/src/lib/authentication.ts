export interface IAuthentication {
    authenticate(email: string, password: string): Promise<string>
}

class MockedAuthentication implements IAuthentication {
    authenticate(email: string, password: string) {
        return new Promise<string>((resolve, reject) => {
            setTimeout(() => {
                console.log('Mocked authentication request!');
                resolve('imatoken');
            }, 1000);
        });
    }
}

class Authentication implements IAuthentication {
    authenticate(email: string, password: string) {
        const formdata = new FormData();
        formdata.append('username', email);
        formdata.append('password', password);
        return fetch('http://localhost:5000/token', {
            method: 'POST',
            body: formdata
        }).then((res: any) => {
            if (res.ok) return res.json()
        }).then((token: any) => {
            return token.access_token
        })
    }
}

const authentication = new MockedAuthentication()
export default authentication
