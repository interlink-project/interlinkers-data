import { useCallback, useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Breadcrumbs, Button, CircularProgress, Container, Grid, Link, Typography } from '@material-ui/core';
import { teamsApi } from '__fakeApi__';
import { TeamBrowseFilter, TeamBrowseResults } from '../../../components/dashboard/teams';
import useMounted from '../../../hooks/useMounted';
import useSettings from '../../../hooks/useSettings';
import ChevronRightIcon from '../../../icons/ChevronRight';
import PlusIcon from '../../../icons/Plus';

const TeamBrowse = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const getTeams = useCallback(async () => {
    try {
      const data = await teamsApi.getMulti();

      if (mounted.current) {
        setTeams(data);
        setLoading(false)
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  useEffect(() => {
    getTeams();
  }, [getTeams]);
  
  return (
    <>
      <Helmet>
        <title>Dashboard: Team catalogue</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Grid
            alignItems='center'
            container
            justifyContent='space-between'
            spacing={3}
          >
            <Grid item>
              <Typography
                color='textPrimary'
                variant='h5'
              >
                Teams catalogue
              </Typography>
            </Grid>
            <Grid item>
              <Box sx={{ m: -1 }}>
                <Button
                  color='primary'
                  component={RouterLink}
                  startIcon={<PlusIcon fontSize='small' />}
                  sx={{ m: 1 }}
                  to='/dashboard/teams/new'
                  variant='contained'
                >
                  New Team
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <TeamBrowseFilter />
          </Box>
          {loading ? 
          <Box sx={{ display: 'flex', justifyContent: "center", m: 4 }}>
          <CircularProgress />
        </Box>: 
          <Box sx={{ mt: 6 }}>
            <TeamBrowseResults teams={teams} />
          </Box>}
        </Container>
      </Box>
    </>
  );
};

export default TeamBrowse;
