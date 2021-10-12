import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import AuthGuard from '../my_components/guards/AuthGuard';
import DashboardLayout from '../my_components/layouts/DashboardLayout';
import Loadable from './Loadable';

const CoproductionProcessCreate = Loadable(
  lazy(() => import('../my_pages/dashboard/processes/CoproductionProcessCreate'))
);

const CoproductionProcessProfile = Loadable(
  lazy(() => import('../my_pages/dashboard/processes/CoproductionProcessProfile'))
);


const InterlinkerBrowse = Loadable(
  lazy(() => import('../my_pages/dashboard/interlinkers/InterlinkerBrowse'))
);
const InterlinkerCreate = Loadable(
  lazy(() => import('../my_pages/dashboard/interlinkers/InterlinkerCreate'))
);
const InterlinkerDetails = Loadable(
  lazy(() => import('../my_pages/dashboard/interlinkers/InterlinkerDetails'))
);
const InterlinkerFeed = Loadable(
  lazy(() => import('../my_pages/dashboard/interlinkers/InterlinkerFeed'))
);
const InterlinkerProfile = Loadable(
  lazy(() => import('../my_pages/dashboard/interlinkers/InterlinkerProfile'))
);

const TeamBrowse = Loadable(
  lazy(() => import('../my_pages/dashboard/teams/TeamBrowse'))
);
const TeamCreate = Loadable(
  lazy(() => import('../my_pages/dashboard/teams/TeamCreate'))
);
const TeamDetails = Loadable(
  lazy(() => import('../my_pages/dashboard/teams/TeamDetails'))
);
const Editor = Loadable(
  lazy(() => import('../my_pages/dashboard/Editor'))
);
// Dashboard pages

const Account = Loadable(lazy(() => import('../tm_pages/dashboard/Account')));
const Analytics = Loadable(
  lazy(() => import('../tm_pages/dashboard/Analytics'))
);
const Calendar = Loadable(lazy(() => import('../tm_pages/dashboard/Calendar')));
const Chat = Loadable(lazy(() => import('../tm_pages/dashboard/Chat')));
const CustomerDetails = Loadable(
  lazy(() => import('../tm_pages/dashboard/CustomerDetails'))
);
const CustomerEdit = Loadable(
  lazy(() => import('../tm_pages/dashboard/CustomerEdit'))
);
const CustomerList = Loadable(
  lazy(() => import('../tm_pages/dashboard/CustomerList'))
);
const Finance = Loadable(lazy(() => import('../tm_pages/dashboard/Finance')));
const InvoiceDetails = Loadable(
  lazy(() => import('../tm_pages/dashboard/InvoiceDetails'))
);
const InvoiceList = Loadable(
  lazy(() => import('../tm_pages/dashboard/InvoiceList'))
);
const Kanban = Loadable(lazy(() => import('../tm_pages/dashboard/Kanban')));
const Mail = Loadable(lazy(() => import('../tm_pages/dashboard/Mail')));
const OrderDetails = Loadable(
  lazy(() => import('../tm_pages/dashboard/OrderDetails'))
);
const OrderList = Loadable(
  lazy(() => import('../tm_pages/dashboard/OrderList'))
);
const Overview = Loadable(lazy(() => import('../my_pages/dashboard/Overview')));
const ProductCreate = Loadable(
  lazy(() => import('../tm_pages/dashboard/ProductCreate'))
);
const ProductList = Loadable(
  lazy(() => import('../tm_pages/dashboard/ProductList'))
);
// Projects pages

const ProjectBrowse = Loadable(
  lazy(() => import('../tm_pages/dashboard/ProjectBrowse'))
);
const ProjectCreate = Loadable(
  lazy(() => import('../tm_pages/dashboard/ProjectCreate'))
);
const ProjectDetails = Loadable(
  lazy(() => import('../tm_pages/dashboard/ProjectDetails'))
);

// Social pages

const SocialFeed = Loadable(
  lazy(() => import('../tm_pages/dashboard/SocialFeed'))
);
const SocialProfile = Loadable(
  lazy(() => import('../tm_pages/dashboard/SocialProfile'))
);

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
        element: <Overview />,
      },
      {
        path: 'editor',
        element: <Editor />,
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
            element: <CoproductionProcessProfile />,
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
        path: 'account',
        element: <Account />,
      },
      {
        path: 'analytics',
        element: <Analytics />,
      },
      {
        path: 'calendar',
        element: <Calendar />,
      },
      {
        path: 'chat',
        children: [
          {
            path: '/',
            element: <Chat />,
          },
          {
            path: 'new',
            element: <Chat />,
          },
          {
            path: ':threadKey',
            element: <Chat />,
          },
        ],
      },
      {
        path: 'customers',
        children: [
          {
            path: '/',
            element: <CustomerList />,
          },
          {
            path: ':customerId',
            element: <CustomerDetails />,
          },
          {
            path: ':customerId/edit',
            element: <CustomerEdit />,
          },
        ],
      },
      {
        path: 'invoices',
        children: [
          {
            path: '/',
            element: <InvoiceList />,
          },
          {
            path: ':invoiceId',
            element: <InvoiceDetails />,
          },
        ],
      },
      {
        path: 'kanban',
        element: <Kanban />,
      },
      {
        path: 'mail',
        children: [
          {
            path: '/',
            element: <Navigate
              to='/dashboard/mail/all'
              replace
            />,
          },
          {
            path: 'label/:customLabel',
            element: <Mail />,
          },
          {
            path: 'label/:customLabel/:emailId',
            element: <Mail />,
          },
          {
            path: ':systemLabel',
            element: <Mail />,
          },
          {
            path: ':systemLabel/:emailId',
            element: <Mail />,
          },
        ],
      },
      {
        path: 'orders',
        children: [
          {
            path: '/',
            element: <OrderList />,
          },
          {
            path: ':orderId',
            element: <OrderDetails />,
          },
        ],
      },
      {
        path: 'finance',
        element: <Finance />,
      },
      {
        path: 'products',
        children: [
          {
            path: '/',
            element: <ProductList />,
          },
          {
            path: 'new',
            element: <ProductCreate />,
          },
        ],
      },
      {
        path: 'projects',
        children: [
          {
            path: 'browse',
            element: <ProjectBrowse />,
          },
          {
            path: 'new',
            element: <ProjectCreate />,
          },
          {
            path: ':projectId',
            element: <ProjectDetails />,
          },
        ],
      },
      {
        path: 'social',
        children: [
          {
            path: 'feed',
            element: <SocialFeed />,
          },
          {
            path: 'profile',
            element: <SocialProfile />,
          },
        ],
      },
    ],
  },
];
