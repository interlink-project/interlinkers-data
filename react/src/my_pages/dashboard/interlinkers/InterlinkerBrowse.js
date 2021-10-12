import { useCallback, useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Breadcrumbs, Button, Container, Grid, Link, Typography } from '@material-ui/core';
import { interlinkerApi } from '../../../__fakeApi__/interlinkerApi';
import { InterlinkerBrowseFilter, InterlinkerBrowseResults } from '../../../my_components/dashboard/interlinkers';
import useMounted from '../../../hooks/useMounted';
import useSettings from '../../../hooks/useSettings';
import ChevronRightIcon from '../../../icons/ChevronRight';
import PlusIcon from '../../../icons/Plus';
import gtm from '../../../lib/gtm';

const InterlinkerBrowse = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [interlinkers, setInterlinkers] = useState([]);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getInterlinkers = useCallback(async () => {
    try {
      const data = await interlinkerApi.getInterlinkers();

      if (mounted.current) {
        setInterlinkers(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  useEffect(() => {
    getInterlinkers();
  }, [getInterlinkers]);

  return (
    <>
      <Helmet>
        <title>Dashboard: Interlinker catalogue</title>
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
                Interlinkers catalogue
              </Typography>
            </Grid>
            <Grid item>
              <Box sx={{ m: -1 }}>
                <Button
                  color='primary'
                  component={RouterLink}
                  startIcon={<PlusIcon fontSize='small' />}
                  sx={{ m: 1 }}
                  to='/dashboard/interlinkers/new'
                  variant='contained'
                >
                  New Interlinker
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <InterlinkerBrowseFilter />
          </Box>
          <Box sx={{ mt: 6 }}>
            <InterlinkerBrowseResults interlinkers={interlinkers} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default InterlinkerBrowse;
