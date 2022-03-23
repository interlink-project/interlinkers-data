import { Avatar, Box, Button, Divider, Drawer } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Add, Folder, Groups, Workspaces } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import useMounted from 'hooks/useMounted';
import CoproductionprocessCreate from 'pages/dashboard/coproductionprocesses/CoproductionProcessCreate';
import TeamCreate from 'pages/dashboard/teams/TeamCreate';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { coproductionProcessesApi, teamsApi } from '__fakeApi__';
import useAuth from '../../hooks/useAuth';
import Logo from '../Logo';
import NavSection from '../NavSection';
import Scrollbar from '../Scrollbar';
import SearchAppBar from './Search';


const WorkspaceSidebar = (props) => {
  const { onMobileClose, openMobile } = props;
  const navigate = useNavigate();
  const mounted = useMounted();
  const [processes, setProcesses] = useState([]);
  const [loadingProcesses, setLoadingProcesses] = useState(true);
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);

  const location = useLocation();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  const onProcessCreate = (res2) => {
    navigate(`/dashboard/coproductionprocesses/${res2.id}`)
  }

  const onTeamCreate = (res2) => {
    setLoadingTeams(false)
    getTeamsData()
  }

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const auth = useAuth();

  const { user, isAuthenticated } = auth;

  const getProcessesData = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const processes_data = await coproductionProcessesApi.getMine();
        if (mounted.current) {
          setProcesses(processes_data);
          setLoadingProcesses(false)
        }
      } catch (err) {
        console.error(err);
      }
    }
  }, [isAuthenticated, mounted]);

  const getTeamsData = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const teams_data = await teamsApi.getMine();
        if (mounted.current) {
          setTeams(teams_data);
          setLoadingTeams(false)
        }
      } catch (err) {
        console.error(err);
      }
    }

  }, [isAuthenticated, mounted]);

  useEffect(() => {
    getProcessesData();
    getTeamsData();
  }, [getProcessesData, getTeamsData]);

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
        <Divider />
        <Box sx={{ p: 2 }}>
          <NavSection
            title="Recent processes"
            sx={{
              '& + &': {
                mt: 3
              },
              color: "text.secondary"
            }}
            icon={<Workspaces />}
            pathname={location.pathname}
            items={processes && processes.map((process) => {
              return {
                title: process.name,
                path: `/dashboard/coproductionprocesses/${process.id}/overview`,
                icon: process.logotype_link ? <Avatar sx={{ height: "25px", width: "25px" }} src={process.logotype_link} /> : <Folder />
              }
            })}
          />
          <CoproductionprocessCreate getButton={(onClick) => <LoadingButton onClick={onClick} loading={loadingProcesses} fullWidth variant="outlined" sx={{ textAlign: "center", mt: 1, mb: 2}} color="success" startIcon={<Add />} size="small">
            Add
          </LoadingButton>} teams={teams} onCreate={onProcessCreate} />


          <NavSection
            title="Your teams"
            sx={{
              '& + &': {
                mt: 3
              },
              color: "text.secondary"
            }}
            icon={<Groups />}
            pathname={location.pathname}
            items={teams && teams.map((team) => {
              return {
                title: team.name,
                // path: `/dashboard`,
                icon: team.logotype_link ? <Avatar sx={{ height: "25px", width: "25px" }} src={team.logotype_link} /> : <Groups />
              }
            })}
          />
          <TeamCreate onCreate={onTeamCreate} getButton={(onClick) => <LoadingButton onClick={onClick} loading={loadingProcesses} fullWidth variant="outlined" sx={{ textAlign: "center", mt: 1 }} color="success" startIcon={<Add />} size="small">
            Add
            </LoadingButton>} />
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

WorkspaceSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

export default WorkspaceSidebar;
