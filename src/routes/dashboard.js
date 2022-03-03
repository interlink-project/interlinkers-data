import { lazy } from 'react';
import AuthGuard from '../components/guards/AuthGuard';
import DashboardLayout from '../components/layouts/DashboardLayout';
import Loadable from './Loadable';

const PracticePedia = Loadable(
  lazy(() => import('../pages/dashboard/PracticePedia'))
);
const CoproductionProcessProfile = Loadable(
  lazy(() => import('../pages/dashboard/coproductionprocesses/CoproductionProcessProfile'))
);

const InterlinkerBrowse = Loadable(
  lazy(() => import('../pages/dashboard/interlinkers/InterlinkerBrowse'))
);
const InterlinkerDetails = Loadable(
  lazy(() => import('../pages/dashboard/interlinkers/InterlinkerDetails'))
);

const TeamBrowse = Loadable(
  lazy(() => import('../pages/dashboard/teams/TeamBrowse'))
);
const TeamDetails = Loadable(
  lazy(() => import('../pages/dashboard/teams/TeamDetails'))
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
            element: <InterlinkerDetails />,
          },
        ],
      },
      {
        path: 'teams',
        children: [
          {
            path: '',
            element: <TeamBrowse />,
          },
          {
            path: ':teamId',
            element: <TeamDetails />,
          },
        ],
      },
      {
        path: 'practicepedia',
        element: <PracticePedia />,
      },

    ],

  },

];
