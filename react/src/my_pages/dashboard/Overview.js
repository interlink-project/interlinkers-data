import React, { useEffect, useState, useCallback } from 'react';
import useMounted from '../../hooks/useMounted';
import { Helmet } from 'react-helmet-async';
import { truncate } from 'lodash';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Alert,
  Card,
  Divider,
  LinearProgress,
  CardActionArea,
  CircularProgress,
} from '@material-ui/core';

import useSettings from '../../hooks/useSettings';
import PlusIcon from '../../icons/Plus';
import useAuth from '../../hooks/useAuth';
import { Link as RouterLink } from 'react-router-dom';
import { coproductionProcessesApi } from '../../__fakeApi__/processesApi';
import ArrowRightIcon from '@material-ui/icons/ChevronRight';
import { getImageUrl } from '../../axios';

const Overview = () => {
  const { settings } = useSettings();
  const auth = useAuth();
  const { user } = auth;
  const [processes, setProcesses] = useState(null);
  const [loading, setLoading] = useState(true);
  const mounted = useMounted();

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
      <Box sx={{ mt: 2 }}>
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
      </Box>
    );
  };


  const Phase = ({ title, pr }) => (
    <>
      <Grid item xs={12} justifyContent='center' alignItems='center'>
        <Typography color='textSecondary' color='textPrimary' variant='h5'>
          {title}
        </Typography>
      </Grid>
      <Grid
        alignItems='stretch'
        container
        item
        justifyContent='flex-start'
        spacing={3}
        xs={12}
      >
        {loading && <CircularProgress />}
        {!loading && (!pr || pr.length === 0) && (
          <Grid item xs={12}>
            <Alert severity='info'>Nothing here...</Alert>
          </Grid>
        )}
        {!loading && pr && pr.length > 0 && (
          pr.map((process, i) => (
            <React.Fragment key={`${title}Process${i}`}>
              <Grid item xs={12} md={6} lg={4} xl={3}>
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
            </React.Fragment>
          ))
        )}
      </Grid>
    </>
  );
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
            <Phase
              title={'Engagement processes'}
              pr={
                processes
              }
            />
            <Phase
              title={'Co-design processes'}
              pr={processes && processes.filter((e) => e.phase === 'CODESIGN')}
            />
            <Phase title={'Co-implementation processes'} />
            <Phase
              title={'Co-sustainability processes'}
              pr={
                processes &&
                processes.filter((e) => e.phase === 'COSUSTAINABILITY')
              }
            />
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Overview;
