import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { experimentalStyled } from '@material-ui/core/styles';
import DashboardNavbar from '../navsidebars/DashboardNavbar';
import DashboardSidebar from '../navsidebars/DashboardSidebar';
import { useMediaQuery, useTheme } from '@material-ui/core';
import DashboardMobileAppbar from '../navsidebars/DashboardMobileAppbar';
import ProcessSidebar from 'components/navsidebars/ProcessSidebar';
import { useDispatch, useSelector } from 'react-redux';
import WorkspaceSidebar from 'components/navsidebars/WorkspaceSidebar';

const DashboardLayoutRoot = experimentalStyled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  height: '100%',
  overflow: 'hidden',
  width: '100%',
}));

const DashboardLayoutWrapper = experimentalStyled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
  paddingTop: '64px',
  [theme.breakpoints.up('lg')]: {
    paddingLeft: '240px'
  }
}));

const DashboardLayoutWrapper2 = experimentalStyled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
  paddingTop: '64px',
}));

const DashboardLayoutContainer = experimentalStyled('div')({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden'
});

const DashboardLayoutContent = experimentalStyled('div')({
  flex: '1 1 auto',
  height: '100%',
  overflow: 'auto',
  position: 'relative',
  WebkitOverflowScrolling: 'touch'
});

const DashboardLayout = () => {
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const onMobile = !useMediaQuery(theme.breakpoints.up('sm'));
  const { process, loading } = useSelector((state) => state.process);

  const coproductionProcessLocation = location.pathname.indexOf("/dashboard/coproductionprocesses/") > -1
  const dashboardLocation = location.pathname === "/dashboard"

  const content = <DashboardLayoutContainer>
    <DashboardLayoutContent>
      <Outlet />
      {onMobile && <DashboardMobileAppbar />}

    </DashboardLayoutContent>
  </DashboardLayoutContainer>

  return (
    <DashboardLayoutRoot>
      <DashboardNavbar onSidebarMobileOpen={() => setIsSidebarMobileOpen(true)} />
      {coproductionProcessLocation && <ProcessSidebar
        onMobileClose={() => setIsSidebarMobileOpen(false)}
        openMobile={isSidebarMobileOpen}
      />}
      {dashboardLocation && <WorkspaceSidebar
        onMobileClose={() => setIsSidebarMobileOpen(false)}
        openMobile={isSidebarMobileOpen}
      />}
      {coproductionProcessLocation || dashboardLocation ? <DashboardLayoutWrapper>{content}</DashboardLayoutWrapper> : <DashboardLayoutWrapper2>{content}</DashboardLayoutWrapper2>}
    </DashboardLayoutRoot>
  );
};

export default DashboardLayout;
