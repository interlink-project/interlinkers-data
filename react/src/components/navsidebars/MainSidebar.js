import React, { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, Divider, Drawer, Link } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Logo from '../LightLogo';
import { landingPages, UserAreaButton } from './MainNavbar';

const MainSidebar = (props) => {
  const { onMobileClose, openMobile } = props;
  const location = useLocation();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  return (
    <Drawer
      anchor='left'
      onClose={onMobileClose}
      open={!lgUp && openMobile}
      variant='temporary'
      PaperProps={{
        sx: {
          backgroundColor: 'background.default',
          width: 256,
        },
      }}
    >
      <Box
        sx={{
          alignItems: 'flex-start',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          p: 2,
        }}
      >
          <Logo />
        <Box sx={{ mt: 3 }}>
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
              <Divider
                sx={{
                  my: 1
                }}
              />
            </React.Fragment>
          ))}
        </Box>


        <UserAreaButton />
      </Box>
    </Drawer>
  );
};

MainSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

export default MainSidebar;
