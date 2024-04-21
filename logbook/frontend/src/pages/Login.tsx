import { useContext } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import authentication from '../lib/authentication';
import { StoreContext } from '../index';
import { observer } from 'mobx-react-lite';


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
                setError('root', { type: 'custom', message: 'authentication failure'})
            });
    };

    return <form onSubmit={handleSubmit(onSubmit)}>
        <input type='email' {...register('email', { required: true })} /><br />
        <input type='password' {...register('password', { required: true })} /><br />
        <input type='submit' disabled={isSubmitting} /><br />
        {errors.root ? (<span>{errors.root.message}</span>) : null}
    </form>
})

export default Login;
