import { lazy } from 'react';
import GuestGuard from '../components/guards/GuestGuard';
import Callback from '../pages/authentication/Callback';
import Logout from '../pages/authentication/Logout';
import LogoutCallback from '../pages/authentication/LogoutCallback';
import SilentRenew from '../pages/authentication/SilentRenew';
import Loadable from './Loadable';

const Login = Loadable(lazy(() => import('../pages/authentication/Login')));

export const routes = [
  {
    path: 'callback',
    element: <Callback />,
  },
  {
    path: 'logout',
    element: <Logout />,
  },
  {
    path: 'silentRenew',
    element: <SilentRenew />,
  },
  {
    path: 'logoutCallback',
    element: <LogoutCallback />,
  },
  {
    path: 'authentication',
    children: [
      {
        path: 'login',
        element: (
          <GuestGuard>
            <Login />
          </GuestGuard>
        ),
      },
    ],
  },
];
