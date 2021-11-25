import { useEffect } from 'react';
import { Link as RouterLink, useLocation, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Avatar, Box, Divider, Drawer, Link, Typography } from '@material-ui/core';
import { Dashboard as DashboardIcon, FolderOpen as FolderOpenIcon, HomeRepairService as HomeRepairServiceIcon, Link as LinkIcon, Group as GroupIcon } from '@material-ui/icons';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import Logo from '../Logo';
import NavSection from '../NavSection';
import Scrollbar from '../Scrollbar'; import useAuth from '../../hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { Timeline, Dashboard, BubbleChart, Forum, Settings, FolderOpen } from '@material-ui/icons';
import { getImageUrl } from 'axiosInstance';
// /dashboard/account


const ProcessSidebar = (props) => {
  const { onMobileClose, openMobile } = props;
  const { process } = useSelector((state) => state.process);

  const location = useLocation();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const processId = location.pathname.replace("/dashboard/coproductionprocesses/", "").split("/")[0]
  
  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);


  const sections = [

    {
      title: "",
      items: [
        {
          title: 'Overview',
          path: `/dashboard/coproductionprocesses/${processId}/overview`,
          icon: <Dashboard />
        },
        {
          title: 'Workplan',
          path: `/dashboard/coproductionprocesses/${processId}/workplan`,
          icon: <Timeline />
        },
        {
          title: 'Repository',
          path: `/dashboard/coproductionprocesses/${processId}/repository`,
          icon: <FolderOpen />
        },
        {
          title: 'Network',
          path: `/dashboard/coproductionprocesses/${processId}/network`,
          icon: <BubbleChart />
        },
        {
          title: 'Forum',
          path: `/dashboard/coproductionprocesses/${processId}/forum`,
          icon: <Forum />
        },
        {
          title: 'Settings',
          path: `/dashboard/coproductionprocesses/${processId}/settings`,
          icon: <Settings />
        }
      ]
    },
  ];
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        color: "text.secondary"
      }}
    >
      <Scrollbar options={{ suppressScrollX: true }}>
        <Box
          sx={{
            display: {
              lg: 'none',
              xs: 'flex'
            },
            justifyContent: 'center',
            p: 2
          }}
        >
          <RouterLink to='/'>
            <Logo
              sx={{
                height: 40,
                width: 40
              }}
            />
          </RouterLink>
        </Box>
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: 'background.default',
              borderRadius: 1,
              display: 'flex',
              overflow: 'hidden',
              p: 2
            }}
          >
            <RouterLink to='/dashboard/account'>
              <Avatar sx={{
                cursor: 'pointer',
                height: 48,
                width: 48
              }} variant="square" sx={process && !process.logotype ? { bgcolor: red[500] } : {}} aria-label="recipe" src={process && process.logotype && getImageUrl(process.logotype)}>
                {process && !process.logotype && process.name[0]}
              </Avatar>

            </RouterLink>
            <Box sx={{ ml: 2 }}>
              <Typography
                color='textPrimary'
                variant='subtitle2'
              >
                {process && process.name}
              </Typography>

            </Box>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          {sections.map((section) => (
            <NavSection
              key={section.title}
              pathname={location.pathname}
              sx={{
                '& + &': {
                  mt: 3
                }
              }}
              {...section}
            />
          ))}
        </Box>
      </Scrollbar>
    </Box>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor='left'
        open
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            height: 'calc(100% - 64px) !important',
            top: '64px !Important',
            width: 420,
            paddingLeft: '220px',
            zIndex: 0
          }
        }}
        variant='permanent'
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor='left'
      onClose={onMobileClose}
      open={openMobile}
      PaperProps={{
        sx: {
          backgroundColor: 'background.paper',
          width: 440,
          paddingLeft: '220px',
          zIndex: 0
        }
      }}
      variant='temporary'
    >
      {content}
    </Drawer>
  );
};

ProcessSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

export default ProcessSidebar;
