import {
  AppBar,
  Box,
  ButtonBase,
  Divider,
  IconButton,
  Link,
  Toolbar,
  Typography
} from '@material-ui/core';
import { Login } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from '../../icons/Menu';
import Logo from '../Logo';

export const landingPages = [
  {
    name: 'Project',
    link: '/',
  },
  {
    name: 'INTERLINK platform',
    link: '/platform',
  },
  {
    name: 'Co-production',
    link: '/coprod',
  },
  {
    name: 'Catalogue',
    link: '/catal',
  },
  {
    name: 'About',
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
          <Logo
            sx={{
              display: {
                md: 'inline',
                xs: 'none',
              },
              height: 40,
              width: 40,
            }}
          />
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
          <Box
            component={ButtonBase}
            sx={{
              alignItems: 'center',
              display: 'flex',
            }}
            onClick={() => navigate("/dashboard")}
          >
            <Typography sx={{ mr: 1 }} variant="overline">Dashboard</Typography>
            <Login />
          </Box>
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