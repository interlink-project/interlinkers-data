import {
  AppBar,
  Box, Divider,
  IconButton,
  Link,
  Toolbar
} from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import i18n from 'translations/i18n';
import MenuIcon from '../../icons/Menu';
import { LandingNavbarLogo } from '../Logo';
import SettingsPopover from './SettingsPopover';

export const landingPages = [
  {
    name: i18n.t('Project'),
    link: '/',
  },
  {
    name: i18n.t('INTERLINK platform'),
    link: '/platform',
  },
  {
    name: i18n.t('Co-production'),
    link: '/coprod',
  },
  {
    name: i18n.t('Catalogue'),
    link: '/catal',
  },
  {
    name: i18n.t('About'),
    link: '/about',
  },
];

export const UserAreaButton = () => {
  return (
    <Link
      color='primary'
      component={RouterLink}
      to={'/dashboard'}
      underline='none'
      variant='contained'
    >
      Dashboard
    </Link>
  );
};

const MainNavbar = (props) => {
  const { onSidebarMobileOpen } = props;
  const navigate = useNavigate();

  let location = useLocation();
  return (
    <AppBar
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        color: 'text.secondary',
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        <IconButton
          color='inherit'
          onClick={onSidebarMobileOpen}
          sx={{
            display: {
              md: 'none',
            },
          }}
        >
          <MenuIcon fontSize='small' />
        </IconButton>
        <RouterLink to='/'>
          <LandingNavbarLogo />
        </RouterLink>
        <Box sx={{ flexGrow: 1 }} />
        <Box
          sx={{
            alignItems: 'center',
            display: {
              md: 'flex',
              xs: 'none',
            },
          }}
        >
          {landingPages.map((el, i) => (
            <React.Fragment key={`sidebarItem${i}`}>
              <Link
                color={location.pathname === el.link ? 'primary' : 'textSecondary'}
                component={RouterLink}
                to={el.link}
                underline='none'
                variant='body1'
              >
                {el.name}
              </Link>
              {true && <Divider
                orientation='vertical'
                sx={{
                  height: 32,
                  mx: 2,
                }}
              />}

            </React.Fragment>
          ))}
          <SettingsPopover />
          {/* <Box
            component={ButtonBase}
            sx={{
              alignItems: 'center',
              display: 'flex',
            }}
            color="primary"
            onClick={() => navigate("/dashboard")}
          >
            <Typography sx={{ mr: 1, color: "primary.main" }} variant="overline">Dashboard</Typography>
            <Login />
          </Box> */}
        </Box>
      </Toolbar>
      <Divider />
    </AppBar>
  );
};

MainNavbar.propTypes = {
  onSidebarMobileOpen: PropTypes.func,
};

export default MainNavbar;