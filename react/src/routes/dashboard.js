import { lazy } from 'react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import Loadable from './Loadable';

const CoproductionProcessProfile = Loadable(
  lazy(() => import('../pages/dashboard/coproductionprocesses/CoproductionProcessProfile'))
);

const Catalogue = Loadable(
  lazy(() => import('../pages/dashboard/interlinkers/Catalogue'))
);
const InterlinkerProfile = Loadable(
  lazy(() => import('../components/dashboard/interlinkers/profile/InterlinkerProfile'))
);
const Organizations = Loadable(
  lazy(() => import('../pages/dashboard/organizations/index'))
);
const Workspace = Loadable(lazy(() => import('../pages/dashboard/workspace')));

export const routes = [
  {
    path: 'dashboard',
    element: (
      <DashboardLayout />
    ),
    children: [
      {
        path: '',
        element: <Workspace />,
      },

      {
        path: 'coproductionprocesses',
        children: [
          {
            path: ':processId',
            children: [
              {
                path: '',
                element: <CoproductionProcessProfile />,
              },
              {
                path: ':tab',
                element: <CoproductionProcessProfile />,
              },
            ]
          },
        ],
      },
      {
        path: 'interlinkers',
        children: [
          {
            path: '',
            element: <Catalogue />,
          },
          {
            path: ':interlinkerId',
            element: <InterlinkerProfile />,
          },
        ],
      },
      {
        path: 'organizations',
        children: [
          {
            path: '',
            element: <Organizations />,
          },
          {
            path: ':organizationId',
            element: <></>,
          },
        ],
      }
    ],

  },

];
