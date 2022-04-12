import { Avatar, Box, Button, Chip, Divider, Drawer, Skeleton, Stack, Typography } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AccountTree, ArrowBack, Dashboard, Group as GroupIcon, Settings, Timeline } from '@material-ui/icons';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Logo from '../Logo';
import NavSection from '../NavSection';
import Scrollbar from '../Scrollbar';

const ProcessSidebar = (props) => {
  const { onMobileClose, openMobile } = props;
  const { process, loading, updating } = useSelector((state) => state.process);
  const navigate = useNavigate();
  const location = useLocation();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const processId = process && process.id

  const { t, i18n } = useTranslation()
  const processLanguage = i18n.getFixedT(process && process.language);

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
          title: processLanguage('Overview'),
          path: `/dashboard/coproductionprocesses/${processId}/overview`,
          icon: <Dashboard />
        },
        {
          title: processLanguage('Workplan'),
          path: `/dashboard/coproductionprocesses/${processId}/workplan`,
          icon: <Timeline />
        },
        {
          title: processLanguage('Guide'),
          path: `/dashboard/coproductionprocesses/${processId}/guide`,
          icon: <AccountTree />
        },
        {
          title: processLanguage('Team'),
          path: `/dashboard/coproductionprocesses/${processId}/team`,
          icon: <GroupIcon />
        },
        {
          title: processLanguage('Settings'),
          path: `/dashboard/coproductionprocesses/${processId}/metadata`,
          icon: <Settings />
        },
      ]
    },
  ];
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
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
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={1}
          sx={{ p: 3 }}
        >

          {!loading && !updating ? <Avatar variant="rounded" sx={{ width: "80px", height: "80px" }} src={process && process.logotype_link} /> : <Skeleton variant="rounded" sx={{ width: "80px", height: "80px" }} />}
          <Typography sx={{ textAlign: "center", width: "100%" }} variant="h6">{!loading && !updating && process ? process.name : <Skeleton />}</Typography>
          <Chip color="primary" label="In progress" color="success" />
          <Button startIcon={<ArrowBack />} variant="outlined" fullWidth size="large" onClick={() => navigate("/dashboard")} />

        </Stack>
        <Divider />
        <Box sx={{ p: 2 }}>
          {!loading && sections.map((section) => (
            <NavSection
              key={section.title}
              pathname={location.pathname}
              sx={{
                '& + &': {
                  mt: 3
                },
                color: "text.secondary"
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
            width: 300,
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
          width: 220,
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
