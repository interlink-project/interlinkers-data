import { useMediaQuery, useTheme } from '@material-ui/core';
import { experimentalStyled } from '@material-ui/core/styles';
import ProcessSidebar from 'components/navsidebars/ProcessSidebar';
import WorkspaceSidebar from 'components/navsidebars/WorkspaceSidebar';
import useAuth from 'hooks/useAuth';
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardMobileAppbar from '../navsidebars/DashboardMobileAppbar';
import DashboardNavbar from '../navsidebars/DashboardNavbar';

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
    paddingLeft: '300px'
  }
}));

const MobileLayoutWrapper = experimentalStyled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
  paddingBottom: '70px',

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
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const onMobile = !useMediaQuery(theme.breakpoints.up('sm'));

  const coproductionProcessLocation = location.pathname.indexOf("/dashboard/coproductionprocesses/") > -1
  const dashboardLocation = isAuthenticated && (location.pathname === "/dashboard" || location.pathname === "/dashboard/")

  const content = <DashboardLayoutContainer>
    <DashboardLayoutContent>
      <Outlet />
      {onMobile && <DashboardMobileAppbar />}

    </DashboardLayoutContent>
  </DashboardLayoutContainer>

  return (
    <DashboardLayoutRoot>
      {!onMobile && <DashboardNavbar showOpenMenuButton={dashboardLocation || coproductionProcessLocation} onSidebarMobileOpen={() => setIsSidebarMobileOpen(true)} />}
      {dashboardLocation && <WorkspaceSidebar
        onMobileClose={() => setIsSidebarMobileOpen(false)}
        openMobile={isSidebarMobileOpen}
      />}
      {coproductionProcessLocation && <ProcessSidebar
        onMobileClose={() => setIsSidebarMobileOpen(false)}
        openMobile={isSidebarMobileOpen}
      />}
      {onMobile ? <MobileLayoutWrapper>{content}</MobileLayoutWrapper> : <> 
      {coproductionProcessLocation || dashboardLocation ? <DashboardLayoutWrapper>{content}</DashboardLayoutWrapper> : <DashboardLayoutWrapper2>{content}</DashboardLayoutWrapper2>}
      </>}
    </DashboardLayoutRoot>
  );
};

export default DashboardLayout;
