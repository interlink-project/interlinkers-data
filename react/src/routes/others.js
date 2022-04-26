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
const HomeAbout = Loadable(lazy(() => import('../pages/HomeAbout')));
const HomeCoproduction = Loadable(lazy(() => import('../pages/HomeCoproduction')));
const HomePlatform = Loadable(lazy(() => import('../pages/HomePlatform')));
const HomeCatalogue = Loadable(lazy(() => import('../pages/HomeCatalogue')));

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
        path: '/coprod',
        element: <HomeCoproduction />,
      },
      {
        path: '/platform',
        element: <HomePlatform />,
      },
      {
        path: '/catal',
        element: <HomeCatalogue />,
      },
      {
        path: '/about',
        element: <HomeAbout />,
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
