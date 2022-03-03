import { Box, Button, CircularProgress, Container, Dialog, DialogContent, DialogTitle, Grid, ListItemText, Menu, MenuItem, Pagination, ToggleButton, ToggleButtonGroup, Typography } from '@material-ui/core';
import { ArrowDropDown, ViewModule } from '@material-ui/icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { interlinkersApi } from '__fakeApi__';
import { InterlinkerBrowseFilter, InterlinkerCard } from '../../../components/dashboard/interlinkers';
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

  const [open, setOpen] = useState(false);

  const [interlinkers, setInterlinkers] = useState([])
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);

  const [interlinker, setInterlinker] = useState(null);

  const sortRef = useRef(null);
  const [openSort, setOpenSort] = useState(false);
  const [mode, setMode] = useState('grid');

  const pagesCount = Math.round(total / size)

  const handleSortOpen = () => {
    setOpenSort(true);
  };
  const handleSortClose = () => {
    setOpenSort(false);
  };

  const handleSortSelect = (value) => {
    setSelectedSort(value);
    setOpenSort(false);
  };

  const handleModeChange = (event, value) => {
    setMode(value);
  };

  const getInterlinkers = useCallback(async (page, size, search, nature, creator) => {
    try {
      if (mounted.current) {
        // load first page, 6 results
        interlinkersApi.getMulti({page, size, search, nature, creator}).then(res => {
          setInterlinkers(res.items)
          setTotal(res.total)
          setPage(res.page)
          setSize(res.size)
          setLoading(false)
        })
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  const handlePaginationChange = (event, value) => {
    getInterlinkers(value, size)
  };

  const onFiltersChange = (search, nature, creator) => {
    setPage(1)
    getInterlinkers(page, size, search, nature, creator)
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);


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
            <InterlinkerBrowseFilter onFiltersChange={onFiltersChange} />
          </Box>
          {loading ?
            <Box sx={{ display: 'flex', justifyContent: "center", m: 4 }}>
              <CircularProgress />
            </Box> :
            <Box sx={{ mt: 6 }}>


              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  mb: 2
                }}
              >
                <Typography
                  color='textPrimary'
                  sx={{
                    position: 'relative',
                    '&:after': {
                      backgroundColor: 'primary.main',
                      bottom: '-8px',
                      content: '" "',
                      height: '3px',
                      left: 0,
                      position: 'absolute',
                      width: '48px'
                    }
                  }}
                  variant='h6'
                > {total}
                  {' '}
                  interlinkers found
                </Typography>
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex'
                  }}
                >
                  <ToggleButtonGroup
                    exclusive
                    onChange={handleModeChange}
                    size='small'
                    value={mode}
                  >
                    <ToggleButton value='grid'>
                      <ViewModule fontSize='small' />
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </Box>
              
              
              <Grid
                container
                spacing={3}
              >
                {interlinkers.map((interlinker) => (
                  <Grid
                    item
                    key={interlinker.id}
                    md={mode === 'grid' ? 4 : 12}
                    sm={mode === 'grid' ? 6 : 12}
                    xs={12}
                  >
                    <InterlinkerCard interlinker={interlinker} onInterlinkerClick={(i) => {
                      setInterlinker(i)
                      handleClickOpen()
                    }} mode={mode} />
                  </Grid>
                ))}
              </Grid>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 6
                }}
              >
                {pagesCount > 0 && <Pagination count={pagesCount} page={page} onChange={handlePaginationChange} />}
              </Box>

            </Box>}
        </Container>
        <Dialog fullWidth={true}
          maxWidth="lg"
          onClose={handleClose}
          open={interlinker && open ? true : false}
          sx={{ py: 0 }}
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
      </Box>
    </>
  );
};

export default InterlinkerBrowse;
