import { Avatar, Box, Divider, Drawer } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Add, Folder, Groups, Workspaces } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import useMounted from 'hooks/useMounted';
import CoproductionprocessCreate from 'pages/dashboard/coproductionprocesses/CoproductionProcessCreate';
import TeamCreate from 'pages/dashboard/teams/TeamCreate';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { getMyProcesses, getMyTeams } from 'slices/general';
import useAuth from '../../hooks/useAuth';
import Logo from '../Logo';
import NavSection from '../NavSection';
import Scrollbar from '../Scrollbar';


const WorkspaceSidebar = (props) => {
  const { onMobileClose, openMobile } = props;
  const navigate = useNavigate();
  const mounted = useMounted();
  const dispatch = useDispatch();
  const { teams, processes, loadingTeams, loadingProcesses } = useSelector((state) => state.general);

  const location = useLocation();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  const [teamCreatorOpen, setOpenTeamCreator] = useState(false);
  const [creatingTeam, setCreatingTeam] = useState(false);

  const [coproductionProcessCreatorOpen, setCoproductionProcessCreatorOpen] = useState(false);
  const [coproductionProcessLoading, setCoproductionProcessLoading] = useState(false);

  const onProcessCreate = (res2) => {
    navigate(`/dashboard/coproductionprocesses/${res2.id}/overview`)
  }

  const onTeamCreate = (res2) => {
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
      dispatch(getMyProcesses())
    }
  }, [isAuthenticated]);

  const getTeamsData = useCallback(async () => {
    if (isAuthenticated) {
      dispatch(getMyTeams())
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
          <LoadingButton onClick={() => setCoproductionProcessCreatorOpen(true)} loading={loadingProcesses} fullWidth variant="outlined" sx={{ textAlign: "center", mt: 1, mb: 2 }} color="success" startIcon={<Add />} size="small">
            Add
          </LoadingButton>
          <CoproductionprocessCreate
            open={coproductionProcessCreatorOpen}
            setOpen={setCoproductionProcessCreatorOpen}
            loading={coproductionProcessLoading}
            setLoading={setCoproductionProcessLoading}
            onCreate={onProcessCreate}
          />

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
                path: `/dashboard/teams/${team.id}`,
                icon: team.logotype_link ? <Avatar sx={{ height: "25px", width: "25px" }} src={team.logotype_link} /> : <Groups />
              }
            })}
          />
          <TeamCreate
            open={teamCreatorOpen}
            setOpen={setOpenTeamCreator}
            onCreate={onTeamCreate}
            loading={creatingTeam}
            setLoading={setCreatingTeam}
          />
          <LoadingButton onClick={() => setOpenTeamCreator(true)} loading={loadingTeams} fullWidth variant="outlined" sx={{ textAlign: "center", mt: 1 }} color="success" startIcon={<Add />} size="small">
            Add
          </LoadingButton>
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
