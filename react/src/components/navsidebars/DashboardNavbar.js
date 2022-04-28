import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AppBar, Box, IconButton, Toolbar, useMediaQuery, useTheme, MenuItem, Typography, Button } from '@material-ui/core';
import { experimentalStyled } from '@material-ui/core/styles';
import MenuIcon from '../../icons/Menu';
import AccountPopover from './AccountPopover';
import NotificationsPopover from './NotificationsPopover';
import SettingsPopover from './SettingsPopover';
import SearchAppBar from './Search';
import { useTranslation } from 'react-i18next';
import i18n from 'translations/i18n';
import useSettings from 'hooks/useSettings';

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
    sx: {ml: 2},
    label: i18n.t("Workspace"),
    path: '/dashboard',
  },
  {
    label: i18n.t("Interlinkers"),
    path: '/dashboard/interlinkers',
  },
  {
    label: i18n.t("Public Services"),
    path: '/dashboard/publicservices',
    disabled: true
  }
]
const DashboardNavbar = (props) => {
  const { onSidebarMobileOpen, showOpenMenuButton, ...other } = props;
  const {t} = useTranslation()
  const {settings} = useSettings()

  const theme = useTheme();
  const onMobile = !useMediaQuery(theme.breakpoints.up('sm'));

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

        {!onMobile && <RouterLink to='/'>
          <img
            alt='Logo'
            src={"/static/customization/" + settings.customData.logos.light}
            height='40px'
          />
        </RouterLink>}
        {pages.map(page => <Button sx={{ml: 2, ...page.sx}} component={RouterLink} to={page.path} color="inherit" variant={window.location.pathname === page.path ? "outlined" : "text"} disabled={page.disabled}>
          <Typography textAlign="center" variant="button">{page.label}</Typography>
        </Button>)}
        <Box
          sx={{
            flexGrow: 1,
            ml: 2,
          }}
        />
        <Box sx={{ ml: 1 }}>
          <SettingsPopover />
        </Box>
        <Box sx={{ ml: 1 }}>
          <SearchAppBar />
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
