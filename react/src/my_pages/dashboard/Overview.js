import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Button, Container, Grid, Typography } from '@material-ui/core';
import OverviewCard from '../../my_components/dashboard/overview/OverviewCard';
import useSettings from '../../hooks/useSettings';
import PlusIcon from '../../icons/Plus';
import useAuth from '../../hooks/useAuth';

const Overview = () => {
  const { settings } = useSettings();
  const auth = useAuth();
  const { user } = auth;

  return (
    <>
      <Helmet>
        <title>Dashboard: Overview</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8,
        }}
      >
        <Container>
          <Grid
            container
            spacing={3}
          >
            <Grid
              alignItems='center'
              container
              justifyContent='space-between'
              spacing={3}
              item
              xs={12}
            >
              <Grid item>
                <Typography
                  color='textSecondary'
                  variant='overline'
                >
                  Overview
                </Typography>
                <Typography
                  color='textPrimary'
                  variant='h5'
                >
                  Welcome,
                  {' '}
                  {user.given_name}
                </Typography>
                <Typography
                  color='textSecondary'
                  variant='subtitle2'
                >
                  Here&apos;s what&apos;s happening today
                </Typography>
              </Grid>
              {/* <Grid item>
                <Button
                  color='primary'
                  startIcon={<PlusIcon fontSize='small' />}
                  variant='contained'
                >
                  New Transaction
                </Button>
              </Grid> */}
            </Grid>
            <Grid
              item
              md={4}
              xs={6}
            >
              <Typography
                color='textSecondary'
                variant='overline'
              >
                Co-design processes
              </Typography>
              <OverviewCard
                title='1'
                description='example'
                buttonText='action'
                arrowDown
              />
            </Grid>
            <Grid
              item
              md={4}
              xs={6}
            >
              <Typography
                color='textSecondary'
                variant='overline'
              >
                Co-delivery processes
              </Typography>
              <OverviewCard
                title='Citizen folder'
                description='Service which allows access all public services...'
                buttonText='action'
                component={(
                  <img
                    src='https://i.ibb.co/RH1xVrw/Captura-de-pantalla-2021-09-28-a-las-10-23-23.png'
                    width='80px'
                    style={{ margin: 7 }}
                  />
                )}
              />
            </Grid>
            <Grid
              item
              md={4}
              xs={6}
            >
              <Typography
                color='textSecondary'
                variant='overline'
              >
                Ongoing collaboration
              </Typography>
              <OverviewCard
                title='2'
                description='example'
                buttonText='action'
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Overview;
