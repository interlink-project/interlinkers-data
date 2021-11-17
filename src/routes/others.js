import { lazy } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import Loadable from './Loadable';

// Error pages

const AuthorizationRequired = Loadable(
  lazy(() => import('../pages/AuthorizationRequired'))
);
const NotFound = Loadable(lazy(() => import('../pages/NotFound')));
const ServerError = Loadable(lazy(() => import('../pages/ServerError')));

const Home = Loadable(lazy(() => import('../pages/Home')));

export const routes = [
  {
    path: '*',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '401',
        element: <AuthorizationRequired />,
      },
      {
        path: '404',
        element: <NotFound />,
      },
      {
        path: '500',
        element: <ServerError />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];
