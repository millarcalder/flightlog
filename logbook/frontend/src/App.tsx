import './App.css';
import { useContext, PropsWithChildren, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { StoreContext } from './index';
import Home from './pages/Home';
import Login from './pages/Login';
import NavBar from './components/NavBar';
import queries from './lib/queries';


const Layout = (props: PropsWithChildren) => <>
  <header>
    <NavBar />
  </header>
  {props.children}
</>


const App = observer(() => {
  // The user should be logged in before accessing any pages in this application
  const store = useContext(StoreContext);

  useEffect(() => {
    if (store.accessToken) {
      queries.fetchSites(store.accessToken).then((newSites) => store.setSites(newSites))
    }
  }, [store.accessToken]);

  if (!store.accessToken) return <Login />

  return (
    <RouterProvider router={createBrowserRouter([
      {
        path: '/',
        element: <Layout><Home /></Layout>
      }, {
        path: '/foo',
        element: <Layout>bar</Layout>
      }, {
        path: '/login',
        element: <Layout><Login /></Layout>
      }
    ])} />
  );
})

export default App;
