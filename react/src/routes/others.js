import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import BlogLayout from '../tm_components/blog/BlogLayout';
import BrowseLayout from '../tm_components/BrowseLayout';
import DocsLayout from '../my_components/layouts/DocsLayout';
import MainLayout from '../my_components/layouts/MainLayout';
import Loadable from './Loadable';

// Browse pages
const Browse = Loadable(lazy(() => import('../tm_pages/browse/Browse')));
const BrowseButtons = Loadable(
  lazy(() => import('../tm_pages/browse/BrowseButtons'))
);
const BrowseCharts = Loadable(
  lazy(() => import('../tm_pages/browse/BrowseCharts'))
);
const BrowseColors = Loadable(
  lazy(() => import('../tm_pages/browse/BrowseColors'))
);
const BrowseDetailLists = Loadable(
  lazy(() => import('../tm_pages/browse/BrowseDetailLists'))
);
const BrowseForms = Loadable(
  lazy(() => import('../tm_pages/browse/BrowseForms'))
);
const BrowseGridLists = Loadable(
  lazy(() => import('../tm_pages/browse/BrowseGridLists'))
);
const BrowseGroupedLists = Loadable(
  lazy(() => import('../tm_pages/browse/BrowseGroupedLists'))
);
const BrowseInputs = Loadable(
  lazy(() => import('../tm_pages/browse/BrowseInputs'))
);
const BrowseModals = Loadable(
  lazy(() => import('../tm_pages/browse/BrowseModals'))
);
const BrowseQuickStats = Loadable(
  lazy(() => import('../tm_pages/browse/BrowseQuickStats'))
);
const BrowseTables = Loadable(
  lazy(() => import('../tm_pages/browse/BrowseTables'))
);
const BrowseTypography = Loadable(
  lazy(() => import('../tm_pages/browse/BrowseTypography'))
);

// Blog pages

const BlogPostCreate = Loadable(
  lazy(() => import('../tm_pages/blog/BlogPostCreate'))
);
const BlogPostDetails = Loadable(
  lazy(() => import('../tm_pages/blog/BlogPostDetails'))
);
const BlogPostList = Loadable(
  lazy(() => import('../tm_pages/blog/BlogPostList'))
);

// Docs pages

const Docs = Loadable(lazy(() => import('../my_pages/Docs')));

// Error pages

const AuthorizationRequired = Loadable(
  lazy(() => import('../tm_pages/AuthorizationRequired'))
);
const NotFound = Loadable(lazy(() => import('../tm_pages/NotFound')));
const ServerError = Loadable(lazy(() => import('../tm_pages/ServerError')));

const Checkout = Loadable(lazy(() => import('../tm_pages/Checkout')));
const Contact = Loadable(lazy(() => import('../tm_pages/Contact')));
const Home = Loadable(lazy(() => import('../my_pages/Home')));
const Pricing = Loadable(lazy(() => import('../tm_pages/Pricing')));

export const routes = [
  {
    path: 'blog',
    element: <BlogLayout />,
    children: [
      {
        path: '/',
        element: <BlogPostList />,
      },
      {
        path: 'new',
        element: <BlogPostCreate />,
      },
      {
        path: ':postId',
        element: <BlogPostDetails />,
      },
    ],
  },
  {
    path: 'contact',
    element: <Contact />,
  },
  {
    path: 'docs',
    element: <DocsLayout />,
    children: [
      {
        path: '/',
        element: <Navigate
          to='/docs/overview/welcome'
          replace
        />,
      },
      {
        path: '*',
        element: <Docs />,
      },
    ],
  },
  {
    path: '*',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'browse',
        element: <BrowseLayout />,
        children: [
          {
            path: '/',
            element: <Browse />,
          },
          {
            path: '/buttons',
            element: <BrowseButtons />,
          },
          {
            path: '/inputs',
            element: <BrowseInputs />,
          },
          {
            path: '/charts',
            element: <BrowseCharts />,
          },
          {
            path: '/colors',
            element: <BrowseColors />,
          },
          {
            path: '/data-display/detail-lists',
            element: <BrowseDetailLists />,
          },
          {
            path: '/data-display/quick-stats',
            element: <BrowseQuickStats />,
          },
          {
            path: '/data-display/tables',
            element: <BrowseTables />,
          },
          {
            path: '/forms',
            element: <BrowseForms />,
          },
          {
            path: '/modals',
            element: <BrowseModals />,
          },
          {
            path: '/lists/grouped-lists',
            element: <BrowseGroupedLists />,
          },
          {
            path: '/lists/grid-lists',
            element: <BrowseGridLists />,
          },
          {
            path: '/typography',
            element: <BrowseTypography />,
          },
        ],
      },
      {
        path: 'checkout',
        element: <Checkout />,
      },
      {
        path: 'pricing',
        element: <Pricing />,
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
