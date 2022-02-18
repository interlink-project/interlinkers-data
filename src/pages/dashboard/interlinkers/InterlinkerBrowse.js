import { useCallback, useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Breadcrumbs, Button, CircularProgress, Container, Dialog, DialogTitle, Grid, Link, Typography } from '@material-ui/core';
import { interlinkersApi } from '__fakeApi__';
import { InterlinkerBrowseFilter, InterlinkerBrowseResults } from '../../../components/dashboard/interlinkers';
import useMounted from '../../../hooks/useMounted';
import useSettings from '../../../hooks/useSettings';
import ChevronRightIcon from '../../../icons/ChevronRight';
import PlusIcon from '../../../icons/Plus';
import gtm from '../../../lib/gtm';
import { getInterlinkers } from 'slices/catalogue';
import { useDispatch, useSelector } from 'react-redux';
import InterlinkerDetails from './InterlinkerDetails';

const InterlinkerBrowse = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.catalogue);
  const [open, setOpen] = useState(false);
  const [interlinker, setInterlinker] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const init = useCallback(async () => {
    try {
      if (mounted.current) {
        dispatch(getInterlinkers())
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  useEffect(() => {
    init();
  }, [init]);

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
        <Container maxWidth="lg">
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
          {loading ?
            <Box sx={{ display: 'flex', justifyContent: "center", m: 4 }}>
              <CircularProgress />
            </Box> :
            <Box sx={{ mt: 6 }}>
              <InterlinkerBrowseResults onInterlinkerClick={(i) => {
                setInterlinker(i)
                handleClickOpen()
              }} />
              <Dialog fullWidth={true}
                maxWidth="lg" onClose={handleClose} open={interlinker && open}>
                <InterlinkerDetails interlinker={interlinker} />
              </Dialog>
            </Box>}


        </Container>
      </Box>
    </>
  );
};

export default InterlinkerBrowse;
