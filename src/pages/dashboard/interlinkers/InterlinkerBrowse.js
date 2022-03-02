import { Box, Button, CircularProgress, Container, Dialog, DialogContent, DialogTitle, Grid, Typography } from '@material-ui/core';
import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { getInterlinkers } from 'slices/catalogue';
import { InterlinkerBrowseFilter, InterlinkerBrowseResults } from '../../../components/dashboard/interlinkers';
import useMounted from '../../../hooks/useMounted';
import useSettings from '../../../hooks/useSettings';
import PlusIcon from '../../../icons/Plus';
import gtm from '../../../lib/gtm';
import InterlinkerDetails from './InterlinkerDetails';
import InterlinkerHeader from './InterlinkerHeader';

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
          py: 6
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
                maxWidth="lg"
                onClose={handleClose}
                open={interlinker && open}
                sx={{py: 0}}
              >
                {interlinker && <DialogTitle sx={{
                  backgroundColor: 'background.default',
                }}

                >
                  <InterlinkerHeader interlinker={interlinker} />

                </DialogTitle>
                }
                <DialogContent style={{ minHeight: "70vh" }} sx={{
                  backgroundColor: 'background.default',
                  py: 0
                }}>
                  <InterlinkerDetails interlinker={interlinker} />
                </DialogContent>
              </Dialog>
            </Box>}


        </Container>
      </Box>
    </>
  );
};

export default InterlinkerBrowse;
