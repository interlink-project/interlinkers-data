import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AppBar, Box, IconButton, Toolbar, useMediaQuery, useTheme, MenuItem, Typography } from '@material-ui/core';
import { experimentalStyled } from '@material-ui/core/styles';
import MenuIcon from '../../icons/Menu';
import AccountPopover from './AccountPopover';
import NotificationsPopover from './NotificationsPopover';
import SettingsPopover from './SettingsPopover';
import SearchAppBar from './Search';

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

const DashboardNavbar = (props) => {
  const { onSidebarMobileOpen, ...other } = props;

  const theme = useTheme();
  const onMobile = !useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <DashboardNavbarRoot {...other}>
      <Toolbar sx={{ minHeight: 64 }}>
        {!onMobile && <IconButton
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
            alt='Components'
            src='/static/logo-interlink-white.svg'
            height='40px'
          />
        </RouterLink>}
        <MenuItem sx={{ml: 2}} component={RouterLink} to='/dashboard' selected>
          <Typography textAlign="center" variant="button">Workspace</Typography>
        </MenuItem>
        <MenuItem component={RouterLink} to='/dashboard/interlinkers' >
          <Typography textAlign="center" variant="button">Interlinkers</Typography>
        </MenuItem>
        <MenuItem component={RouterLink} to='/dashboard' disabled>
          <Typography textAlign="center" variant="button">Public services</Typography>
        </MenuItem>
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
