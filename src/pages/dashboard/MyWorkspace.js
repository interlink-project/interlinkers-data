import React, { useEffect, useState, useCallback } from 'react';
import useMounted from '../../hooks/useMounted';
import { Helmet } from 'react-helmet-async';
import { truncate } from 'lodash';
import {
  Box,
  Tabs,
  Tab,
  Button,
  Container,
  Grid,
  Typography,
  Alert,
  Card,
  Divider,
  LinearProgress,
  CardActionArea,
  Skeleton,
  CardActions,
  List, ListItemText, ListItem, ListItemAvatar, Avatar
} from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@material-ui/styles';
import useSettings from '../../hooks/useSettings';
import PlusIcon from '../../icons/Plus';
import useAuth from '../../hooks/useAuth';
import { Link as RouterLink } from 'react-router-dom';
import { coproductionProcessesApi, teamsApi } from '__fakeApi__';
import ArrowRightIcon from '@material-ui/icons/ChevronRight';
import { Add } from '@material-ui/icons';
import TeamCreate from './teams/TeamCreate';
import CoproductionprocessCreate from './coproductionprocesses/CoproductionProcessCreate';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthGuardSkeleton from 'components/guards/AuthGuardSkeleton';

const MyWorkspace = () => {
  const { settings } = useSettings();
  const auth = useAuth();
  const { user, isAuthenticated } = auth;
  const [processes, setProcesses] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loadingProcesses, setLoadingProcesses] = useState(true);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const mounted = useMounted();
  const navigate = useNavigate();

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


  const LoadingItems = () => <>{Array(4).fill().map((e, i) => (<React.Fragment key={`${e}-${i}`}>
    <ListItem alignItems="flex-start" >
      <ListItemAvatar>
        <Skeleton animation="wave" variant="circular" width={40} height={40} />
      </ListItemAvatar>
      <ListItemText
        primary={<Skeleton variant="text" />}
        secondary={
          <Skeleton variant="text" />

        }
      />
    </ListItem>
  </React.Fragment>))}</>

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

  const onTeamCreate = (res2) => {
    setLoadingTeams(true)
    getTeamsData()
  }

  const onProcessCreate = (res2) => {
    navigate(`/dashboard/coproductionprocesses/${res2.id}`)
  }

  useEffect(() => {
    getProcessesData();
    getTeamsData();
  }, [getProcessesData, getTeamsData]);

  const LoggedInWorkspace = () => <> <Grid container spacing={3}>
    <Grid container justifyContent='space-between' item xs={12}>
      <Grid item>
        <Typography color='textSecondary' variant='overline'>
          MyWorkspace
        </Typography>
        <Typography color='textPrimary' variant='h5'>
          Welcome, {user.given_name}
        </Typography>
        <Typography color='textSecondary' variant='subtitle2'>
          Here&apos;s what&apos;s happening today
        </Typography>
      </Grid>
    </Grid>
  </Grid>
    <Grid container spacing={4} sx={{ mt: 2 }}>
      <Grid item xs={6}>
        <Typography color='textPrimary' variant='h6' sx={{ mb: 2 }}>Your co-production processes</Typography>

        <Card>
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {loadingProcesses && <LoadingItems />}
            {processes.map(process => (
              <React.Fragment key={process.id}>
                <ListItem alignItems="flex-start" button component={RouterLink} to={`/dashboard/coproductionprocesses/${process.id}/overview`}>
                  <ListItemAvatar>
                    <Avatar alt={process.name} src={process.logotype} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={process.name}
                    secondary={
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {process.description}
                      </Typography>

                    }
                  />
                </ListItem>
              </React.Fragment>)
            )}
          </List>
          <CardActions>
            <CoproductionprocessCreate teams={teams} onCreate={onProcessCreate} />

          </CardActions>
        </Card>

      </Grid>
      <Grid item xs={6}>
        <Typography color='textPrimary' variant='h6' sx={{ mb: 2 }}>Your teams</Typography>

        <Card>
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {loadingTeams && <LoadingItems />}
            {teams.map(team => (
              <React.Fragment key={team.id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar alt={team.name} src={team.logotype} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={team.name}
                    secondary={
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {team.description}
                      </Typography>

                    }
                  />
                </ListItem>
              </React.Fragment>)
            )}
          </List>
          <CardActions>
            <TeamCreate onCreate={onTeamCreate} />
          </CardActions>
        </Card>
      </Grid>

    </Grid></>

  return (
    <>
      <Helmet>
        <title>Dashboard: MyWorkspace</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8,
          px: 2,
        }}
      >
        <Container maxWidth='lg'>
          <AuthGuardSkeleton height="100%" width="100%">
            <LoggedInWorkspace />
          </AuthGuardSkeleton>
        </Container>
      </Box>
    </>
  );
};

export default MyWorkspace;
