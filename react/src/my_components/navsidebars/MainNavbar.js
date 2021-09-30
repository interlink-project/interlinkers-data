import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Divider,
  IconButton,
  Link,
  Toolbar,
} from '@material-ui/core';
import MenuIcon from '../../icons/Menu';
import Logo from '../Logo';

export const landingPages = [
  {
    name: 'Project',
    link: '',
  },
  {
    name: 'Pilots',
    link: '',
  },
  {
    name: 'Partners',
    link: '',
  },
  {
    name: 'News',
    link: '',
  },
  {
    name: 'Media',
    link: '',
  },
  {
    name: 'Contacts',
    link: '',
  },
  {
    name: 'Browse',
    link: '/browse',
  },
  {
    name: 'Blog',
    link: '/blog',
  },
  {
    name: 'Contact',
    link: '/contact',
  },
];

export const UserAreaButton = () => {
  const navigate = useNavigate();

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
                color='textSecondary'
                component={RouterLink}
                to={el.link}
                underline='none'
                variant='body1'
              >
                {el.name}
              </Link>
              <Divider
                orientation='vertical'
                sx={{
                  height: 32,
                  mx: 2,
                }}
              />
            </React.Fragment>
          ))}
          <UserAreaButton />
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
