import { lazy } from 'react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import Loadable from './Loadable';

const CoproductionProcessProfile = Loadable(
  lazy(() => import('../pages/dashboard/coproductionprocesses/CoproductionProcessProfile'))
);

const InterlinkerBrowse = Loadable(
  lazy(() => import('../pages/dashboard/interlinkers/InterlinkerBrowse'))
);
const InterlinkerProfile = Loadable(
  lazy(() => import('../components/dashboard/interlinkers/profile/InterlinkerProfile'))
);

const MyWorkspace = Loadable(lazy(() => import('../pages/dashboard/MyWorkspace')));

export const routes = [
  {
    path: 'dashboard',
    element: (
      <DashboardLayout />
    ),
    children: [
      {
        path: '/',
        element: <MyWorkspace />,
      },

      {
        path: 'coproductionprocesses',
        children: [
          {
            path: ':processId',
            children: [
              {
                path: '/',
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
            element: <InterlinkerBrowse />,
          },
          {
            path: ':interlinkerId',
            element: <InterlinkerProfile />,
          },
        ],
      }
    ],

  },

];
