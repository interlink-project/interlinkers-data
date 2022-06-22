import { AppBar, Box, Button, IconButton, Toolbar, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import { experimentalStyled } from '@material-ui/core/styles';
import { Search } from '@material-ui/icons';
import { DashboardNavbarLogo } from 'components/Logo';
import useSettings from 'hooks/useSettings';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import i18n from 'translations/i18n';
import MenuIcon from '../../icons/Menu';
import AccountPopover from './AccountPopover';
import HelpPopover from './HelpPopover';
import SearchAppBar from './Search';
import SettingsPopover from './SettingsPopover';

const DashboardNavbarRoot = experimentalStyled(AppBar)(({ theme }) => ({
  ...(theme.palette.mode === 'light' && {
    backgroundColor: theme.palette.primary.main,
    boxShadow: 'none',
    color: theme.palette.primary.contrastText,
  }),
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
    boxShadow: 'none',
  }),
  zIndex: theme.zIndex.drawer + 100,
}));

const pages = [
  {
    sx: { ml: 2 },
    label: i18n.t("Workspace"),
    path: '/dashboard',
  },
  {
    label: i18n.t("Organizations"),
    path: '/dashboard/organizations',
  },
  {
    label: i18n.t("Catalogue"),
    path: '/dashboard/interlinkers',
  },
]
const DashboardNavbar = (props) => {
  const { onSidebarMobileOpen, showOpenMenuButton, ...other } = props;
  const { t } = useTranslation()

  const theme = useTheme();
  const onMobile = !useMediaQuery(theme.breakpoints.up('sm'));
  const onReduced = !useMediaQuery(theme.breakpoints.up('md'));

  return (
    <DashboardNavbarRoot {...other}>
      <Toolbar sx={{ minHeight: 64 }}>
        {!onMobile && showOpenMenuButton && <IconButton
          color='inherit'
          onClick={onSidebarMobileOpen}
          sx={{
            display: {
              lg: 'none',
            },
          }}
        >
          <MenuIcon fontSize='small' />
        </IconButton>}

        {!onReduced && <RouterLink to='/'>
          <DashboardNavbarLogo />
        </RouterLink>}
        {pages.map(page => <Button key={page.path} sx={{ ml: 2, ...page.sx }} component={RouterLink} to={page.path} color="inherit" variant={window.location.pathname === page.path ? "outlined" : "text"} disabled={page.disabled}>
          <Typography textAlign="center" variant="button">{page.label}</Typography>
        </Button>)}
        <Box
          sx={{
            flexGrow: 1,
            ml: 2,
          }}
        />
        <Box sx={{ ml: 1 }}>
          <HelpPopover />
        </Box>
        <Box sx={{ ml: 1 }}>
          <SettingsPopover />
        </Box>
        <Box sx={{ ml: 1 }}>
          {onReduced ? <IconButton sx={{color: "primary.contrastText"}}><Search /></IconButton>: <SearchAppBar />}
        </Box>
        {!onMobile &&
          <>
            {/*
            <Box sx={{ ml: 1 }}>
              <NotificationsPopover />
            </Box>
          */}
            <Box sx={{ ml: 2 }}>
              <AccountPopover />
            </Box>
          </>
        }
        {/*
          <Box sx={{ ml: 1 }}>
            <ContactsPopover />
          </Box>

        */}

      </Toolbar>
    </DashboardNavbarRoot>
  );
};

DashboardNavbar.propTypes = {
  onSidebarMobileOpen: PropTypes.func,
};

export default DashboardNavbar;
