import { lazy } from 'react';
import GuestGuard from '../my_components/guards/GuestGuard';
import Callback from '../my_pages/authentication/oidc/Callback';
import Logout from '../my_pages/authentication/oidc/Logout';
import LogoutCallback from '../my_pages/authentication/oidc/LogoutCallback';
import SilentRenew from '../my_pages/authentication/oidc/SilentRenew';
import Loadable from './Loadable';

const Login = Loadable(lazy(() => import('../my_pages/authentication/Login')));
const PasswordRecovery = Loadable(
  lazy(() => import('../my_pages/authentication/PasswordRecovery'))
);
const PasswordReset = Loadable(
  lazy(() => import('../my_pages/authentication/PasswordReset'))
);
const Register = Loadable(
  lazy(() => import('../my_pages/authentication/Register'))
);
const VerifyCode = Loadable(
  lazy(() => import('../my_pages/authentication/VerifyCode'))
);

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
      {
        path: 'login-unguarded',
        element: <Login />,
      },
      {
        path: 'password-recovery',
        element: <PasswordRecovery />,
      },
      {
        path: 'password-reset',
        element: <PasswordReset />,
      },
      {
        path: 'register',
        element: (
          <GuestGuard>
            <Register />
          </GuestGuard>
        ),
      },
      {
        path: 'verify-code',
        element: <VerifyCode />,
      },
    ],
  },
];
