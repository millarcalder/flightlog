import { useContext } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import authentication from '../lib/authentication';
import { StoreContext } from '../index';
import { observer } from 'mobx-react-lite';
import { Alert, Button, Form, Row, Col } from 'react-bootstrap';


type Inputs = {
    email: string
    password: string
}


const Login = observer(() => {
    const store = useContext(StoreContext);
    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        return authentication.authenticate(data.email, data.password)
            .then((accessToken) => {
                store.setAccessToken(accessToken);
            })
            .catch((err: any) => {
                setError('root', { type: 'custom', message: 'Login failed!'})
            });
    };

    return <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className='m-3'>
            {errors.root ? (<Alert variant='danger'>{errors.root.message}</Alert>) : null}
            <Form.Control type='email' placeholder='Email' {...register('email', { required: true })} /><br />
            <Form.Control type='password' placeholder='Password' {...register('password', { required: true })} /><br />
            <Button variant='primary' type='submit' disabled={isSubmitting}>Login</Button><br />
        </Form.Group>
    </Form>
})

export default Login;
