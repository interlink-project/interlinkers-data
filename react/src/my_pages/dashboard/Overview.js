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
} from '@material-ui/core';

import useSettings from '../../hooks/useSettings';
import PlusIcon from '../../icons/Plus';
import useAuth from '../../hooks/useAuth';
import { Link as RouterLink } from 'react-router-dom';
import { coproductionProcessesApi } from '../../__fakeApi__/processesApi';
import ArrowRightIcon from '@material-ui/icons/ChevronRight';
import { getImageUrl } from '../../axios';
import "./overview.css"

const Overview = () => {
  const { settings } = useSettings();
  const auth = useAuth();
  const { user } = auth;
  const [processes, setProcesses] = useState(null);
  const [loading, setLoading] = useState(true);
  const mounted = useMounted();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const getCoproductionProcesses = useCallback(async () => {
    try {
      const data = await coproductionProcessesApi.getMulti();

      if (mounted.current) {
        setProcesses(data);
        setLoading(false)
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  useEffect(() => {
    getCoproductionProcesses();
  }, [getCoproductionProcesses]);

  const OverviewCard = ({
    link,
    title,
    subtitle,
    description,
    buttonText,
    buttonAction,
    component,
  }) => {

    return (
      <CardActionArea component={RouterLink} to={link}>
        <Card>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between',
              p: 3,
            }}
          >
            <div>
              <Typography
                color='textPrimary'
                sx={{ mt: 1, mb: 1 }}
                variant='h5'
              >
                {`${title}  `}

                {subtitle && (
                  <Typography color={subtitle === "interlinker" ? 'primary' : "secondary"} variant='overline'>
                    ({subtitle})
                  </Typography>
                )}
              </Typography>

              <Typography color='textPrimary' variant='subtitle2'>
                {description}
              </Typography>
            </div>
            {component || <BarChart />}
          </Box>
          <Divider />
          <Box
            sx={{
              px: 3,
              py: 2,
            }}
          >
            <LinearProgress variant='determinate' value={50} />
            {/*<Button
              color='primary'
              endIcon={<ArrowRightIcon fontSize='small' />}
              variant='text'
            >
              {buttonText}
            </Button>*/}
          </Box>
        </Card>
      </CardActionArea>
    );
  };


  const SkeletonCard = () => {
    return (
      <Card>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            p: 3,
          }}
        >
          <div>

            <Typography
              color='textPrimary'
              sx={{ mt: 1, mb: 1 }}
              variant='h5'
            >
              <Skeleton />

              <Typography variant='overline'>
                <Skeleton />
              </Typography>
            </Typography>

            <Typography color='textPrimary' variant='subtitle2'>
              <Skeleton />
            </Typography>
          </div>
          <Skeleton variant="rectangular" width={210} height={118} />
        </Box>
        <Divider />
        <Box
          sx={{
            px: 3,
            py: 2,
          }}
        >
          <Skeleton />
        </Box>
      </Card>
    );
  };

  const SkeletonGrid = () => <><Grid item xs={12} md={6} lg={4} xl={3}>
    <SkeletonCard />
  </Grid><Grid item xs={12} md={6} lg={4} xl={3}>
      <SkeletonCard />
    </Grid><Grid item xs={12} md={6} lg={4} xl={3}>
      <SkeletonCard />
    </Grid><Grid item xs={12} md={6} lg={4} xl={3}>
      <SkeletonCard />
    </Grid><Grid item xs={12} md={6} lg={4} xl={3}>
      <SkeletonCard />
    </Grid><Grid item xs={12} md={6} lg={4} xl={3}>
      <SkeletonCard />
    </Grid></>

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
          px: 2,
        }}
      >
        <Container maxWidth='xl'>

          <Grid container spacing={3}>
            <Grid container justifyContent='space-between' item xs={12}>
              <Grid item>
                <Typography color='textSecondary' variant='overline'>
                  Overview
                </Typography>
                <Typography color='textPrimary' variant='h5'>
                  Welcome, {user.given_name}
                </Typography>
                <Typography color='textSecondary' variant='subtitle2'>
                  Here&apos;s what&apos;s happening today
                </Typography>
              </Grid>
              <Grid item>
                <Box sx={{ m: -1 }}>
                  <Button
                    color='primary'
                    component={RouterLink}
                    startIcon={<PlusIcon fontSize='small' />}
                    sx={{ m: 1 }}
                    to='/dashboard/coproductionprocesses/new'
                    variant='contained'
                  >
                    New Co-production process
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Box sx={{ width: '100%', bgcolor: 'background.paper', mt: 3 }}>
            <Tabs value={value} onChange={handleChange} variant="scrollable"
              scrollButtons="auto"
              aria-label="coproduction processes overview tabs">
              <Tab label="My projects" />
              <Tab label="All projects" />
              <Tab label="My teams" />
              <Tab label="All teams" />
            </Tabs>
          </Box>
          <Grid
            container
            direction="row"
  justifyContent="flex-start"
  alignItems="stretch"
            sx={{ mt: 1 }}
            spacing={3}
          >
            {value === 0 && <>

              {loading && <SkeletonGrid />}
              {!loading && (!processes || processes.length === 0) && (
                <Grid item xs={12}>
                  <Alert sx={{ mt: 2 }} severity='info'>Nothing here...</Alert>
                </Grid>
              )}
              {!loading && processes && processes.length > 0 && (
                <>
                <Grid item xs={12} md={6} lg={4} xl={3} >
                    <Card>
                    
                    <Button variant="contained" sx={{height: "100%", fontSize: "20px"}}>
                      New coproduction process
                      </Button>
                    </Card>
                  </Grid>
                {processes.map((process, i) => (
                  <Grid item xs={12} md={6} lg={4} xl={3} key={process.id}>
                    <OverviewCard
                      link={`/dashboard/coproductionprocesses/${process.id}`}
                      title={process.artefact.name}
                      subtitle={process.artefact.artefact_type}
                      description={truncate(process.artefact.description, {
                        length: 100,
                        separator: ' ',
                      })}
                      buttonText='action'
                      component={
                        <img
                          src={
                            getImageUrl(process.artefact.logotype) ||
                            'https://blogs.oregonstate.edu/acobamo/wp-content/themes/koji/assets/images/default-fallback-image.png'
                          }
                          width='80px'
                          style={{ margin: 7 }}
                        />
                      }
                    />
                  </Grid>
                ))}
                </>
              )}
            </>}

            {value === 1 && <SkeletonGrid />}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Overview;
