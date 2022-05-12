import { useMediaQuery, useTheme } from '@material-ui/core';
import { experimentalStyled } from '@material-ui/core/styles';
import ProcessSidebar from 'components/navsidebars/ProcessSidebar';
import WorkspaceSidebar from 'components/navsidebars/WorkspaceSidebar';
import useAuth from 'hooks/useAuth';
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardMobileAppbar from '../navsidebars/DashboardMobileAppbar';
import DashboardNavbar from '../navsidebars/DashboardNavbar';
import HelpPanel from '../HelpPanel';

const DashboardLayoutRoot = experimentalStyled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  height: '100%',
  overflow: 'hidden',
  width: '100%',
}));

const DashboardLayoutWrapperWithNavbar = experimentalStyled('div')(({ theme }) => ({
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

const DashboardLayoutWrapper = experimentalStyled('div')(({ theme }) => ({
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
    </DashboardLayoutContent>
  </DashboardLayoutContainer>

  return (
    <DashboardLayoutRoot>
      {dashboardLocation && <WorkspaceSidebar
        onMobileClose={() => setIsSidebarMobileOpen(false)}
        openMobile={!onMobile && isSidebarMobileOpen}
      />}
      {coproductionProcessLocation && <ProcessSidebar
        onMobileClose={() => setIsSidebarMobileOpen(false)}
        openMobile={!onMobile && isSidebarMobileOpen}
      />}
      {onMobile ?
        <>
          <MobileLayoutWrapper>{content}</MobileLayoutWrapper>
          <DashboardMobileAppbar />
        </>
        :
        <>
          <DashboardNavbar showOpenMenuButton={dashboardLocation || coproductionProcessLocation} onSidebarMobileOpen={() => setIsSidebarMobileOpen(true)} />
          {coproductionProcessLocation || dashboardLocation ? <DashboardLayoutWrapperWithNavbar>{content}</DashboardLayoutWrapperWithNavbar> : <DashboardLayoutWrapper>{content}</DashboardLayoutWrapper>}
          <HelpPanel />
        </>
      }

    </DashboardLayoutRoot>
  );
};

export default DashboardLayout;
