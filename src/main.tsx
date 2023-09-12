import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import AppContextProvider from './contexts/RouteContext';

import App from './App/App';
import Home from './pages/Home/Home';
import Error from './pages/Error/Error';
import Login from './pages/Login/Login';
import Achat from './pages/Achat/Achat';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<Error />}>
      <Route index element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/achat" element={<Achat />} />
      <Route path="*" element={<Error />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppContextProvider>
      <RouterProvider router={router} />
    </AppContextProvider>
  </React.StrictMode>
);
