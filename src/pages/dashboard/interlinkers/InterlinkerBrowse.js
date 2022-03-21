import { Box, CircularProgress, Container, Dialog, DialogContent, DialogTitle, Grid, LinearProgress, ToggleButton, ToggleButtonGroup, Typography } from '@material-ui/core';
import { ViewModule } from '@material-ui/icons';
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { interlinkersApi } from '__fakeApi__';
import { InterlinkerBrowseFilter, InterlinkerCard } from '../../../components/dashboard/interlinkers';
import useMounted from '../../../hooks/useMounted';
import InterlinkerDetails from './InterlinkerDetails';
import InterlinkerHeader from './InterlinkerHeader';
import { useInViewport } from 'react-in-viewport';

const LoadingBlock = ({callback}) => {
  const myRef = useRef();
  const {
    inViewport,
    enterCount,
    leaveCount,
  } = useInViewport(
    myRef
  );
  useEffect(() => {
    if(inViewport){
      callback && callback()
    }
  }, [inViewport])
  
  return (
    <section ref={myRef}>
      <LinearProgress />
    </section>
  );
};

const InterlinkerBrowse = () => {
  const mounted = useMounted();
  const [open, setOpen] = useState(false);
  const [interlinker, setInterlinker] = useState(null);
  const [mode, setMode] = useState('grid');

  const handleModeChange = (event, value) => {
    setMode(value);
  };

  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(9);
  const [params, setParams] = useState({});
  const [loadedRows, setLoadedRows] = useState([]);

  const hasNextPage = loadedRows.length < total

  
  useEffect(() => {
    loadServerRows(params)
  }, [params])

  const loadServerRows = async (params) => {
    setLoading(true);
    try {
      interlinkersApi.getMulti({ page: page + 1, size, ...params }).then(res => {
        if (mounted.current) {
          setLoading(false);
          setPage(page + 1)
          setTotal(res.total)
          setLoadedRows([...loadedRows, ...res.items].filter((element, index, self) => self.indexOf(el => el.id === element.id) !== index))
        }
      })

    } catch (err) {
      console.error("Failed to load data: ", err);
    }
  };

  const handleOnRowsScrollEnd = async () => {
    console.log(hasNextPage, loadedRows.length, "/", total)
    if (hasNextPage) {
      loadServerRows();
    }
  };

  const onFiltersChange = (params) => {
    setPage(0)
    setLoadedRows([])
    setParams(params)
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
              {/* <Box sx={{ m: -1 }}>
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
      </Box>*/}
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <InterlinkerBrowseFilter onFiltersChange={onFiltersChange} />
          </Box>

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
              {loadedRows.map((interlinker, i) => (
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
             
                <Grid item xs={12}>
                {loading ? <LinearProgress /> : hasNextPage && (<LoadingBlock callback={() => handleOnRowsScrollEnd()}/>) }
                </Grid>
              
            </Grid>

          </Box>

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
