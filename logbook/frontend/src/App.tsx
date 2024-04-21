import './App.css';
import { useContext, PropsWithChildren } from 'react';
import { observer } from 'mobx-react-lite';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { StoreContext } from './index';
import Home from './pages/Home';
import Login from './pages/Login';
import NavBar from './components/NavBar';


const Layout = (props: PropsWithChildren) => <>
  <header>
    <NavBar />
  </header>
  {props.children}
</>


const App = observer(() => {
  // The user should be logged in before accessing any pages in this application
  const store = useContext(StoreContext);
  if (!store.accessToken) return <Login />

  return (
    <Layout>
      <RouterProvider router={createBrowserRouter([
        {
          path: '/',
          element: <Home />
        }, {
          path: '/login',
          element: <Login />
        }
      ])} />
    </Layout>
  );
})

export default App;
