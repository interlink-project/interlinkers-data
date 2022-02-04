import { lazy } from 'react';
import AuthGuard from '../components/guards/AuthGuard';
import DashboardLayout from '../components/layouts/DashboardLayout';
import Loadable from './Loadable';

const PracticePedia = Loadable(
  lazy(() => import('../pages/dashboard/PracticePedia'))
);
const CoproductionProcessCreate = Loadable(
  lazy(() => import('../pages/dashboard/coproductionprocesses/CoproductionProcessCreate'))
);
const CoproductionProcessProfile = Loadable(
  lazy(() => import('../pages/dashboard/coproductionprocesses/CoproductionProcessProfile'))
);

const InterlinkerBrowse = Loadable(
  lazy(() => import('../pages/dashboard/interlinkers/InterlinkerBrowse'))
);
const InterlinkerCreate = Loadable(
  lazy(() => import('../pages/dashboard/interlinkers/InterlinkerCreate'))
);
const InterlinkerDetails = Loadable(
  lazy(() => import('../pages/dashboard/interlinkers/InterlinkerDetails'))
);

const TeamBrowse = Loadable(
  lazy(() => import('../pages/dashboard/teams/TeamBrowse'))
);
const TeamCreate = Loadable(
  lazy(() => import('../pages/dashboard/teams/TeamCreate'))
);
const TeamDetails = Loadable(
  lazy(() => import('../pages/dashboard/teams/TeamDetails'))
);

const MyWorkspace = Loadable(lazy(() => import('../pages/dashboard/MyWorkspace')));

export const routes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
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
            path: 'new',
            element: <CoproductionProcessCreate />,
          },
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
            path: 'browse',
            element: <InterlinkerBrowse />,
          },
          {
            path: 'new',
            element: <InterlinkerCreate />,
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
            path: 'browse',
            element: <TeamBrowse />,
          },
          {
            path: 'new',
            element: <TeamCreate />,
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