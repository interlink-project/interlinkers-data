import { useCallback, useState, useEffect } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Avatar,
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Divider,
  IconButton,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  Card,
  CardActionArea,
  CardHeader,
  Grid,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Table,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  TableBody

} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';

import { LinkPreview } from "@dhaiwat10/react-link-preview";

import blueGrey from '@material-ui/core/colors/blueGrey';
import AddPhotoIcon from '@material-ui/icons/AddPhotoAlternate';
import { coproductionProcessesApi } from '../../../__fakeApi__/processesApi';
import { socialApi } from '../../../__fakeApi__/socialApi';
import { assetsApi } from '../../../__fakeApi__/assetsApi';
import { SocialConnections, SocialTimeline } from '../../../tm_components/dashboard/social';
import useMounted from '../../../hooks/useMounted';
import DotsVerticalIcon from '../../../icons/DotsVertical';
import gtm from '../../../lib/gtm';
import Tree from 'react-animated-tree'
import ArrowRightIcon from '@material-ui/icons/ChevronRight';
import { useTheme } from '@material-ui/styles';
import MoreVertIcon from '@material-ui/icons/SkipNext';
import AddIcon from '@material-ui/icons/Add';
import moment from 'moment'

const tabs = [
  { label: 'Timeline', value: 'timeline' },
  { label: 'Connections', value: 'connections' }
];

const CoproductionProcessProfile = () => {
  const theme = useTheme();

  const mounted = useMounted();
  const [currentTab, setCurrentTab] = useState('timeline');
  const [selectedTaskInstantiation, setSelectedTaskInstantiation] = useState(null);
  const [profile, setProfile] = useState(null);
  const [process, setProcess] = useState(null);
  const [phaseinstantiations, setPhaseInstantiations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creatingAsset, setCreatingAsset] = useState(false);
  const [connectedStatus, setConnectedStatus] = useState('not_connected');
  const [phase, setPhase] = useState("");

  let { processId } = useParams();

  const [open, setOpen] = useState(false);

  const handleClickOpen = (task) => {
    setSelectedTaskInstantiation(task)
    setOpen(true);


  };
  const closeDialog = () => {
    setOpen(false);
    setSelectedTaskInstantiation(null)
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getProfile = useCallback(async () => {
    try {
      const data = await socialApi.getProfile();

      if (mounted.current) {
        setProfile(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  const getCoproductionProcess = useCallback(async () => {
    try {
      const [data, phasesData] = await Promise.all([
        coproductionProcessesApi.get(processId),
        coproductionProcessesApi.getPhases(processId)
      ]);

      if (mounted.current) {
        setProcess(data);
        setPhaseInstantiations(phasesData)
        setLoading(false)
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  useEffect(() => {
    getCoproductionProcess();
  }, [getCoproductionProcess]);

  const handleConnectToggle = () => {
    setConnectedStatus((prevConnectedStatus) => (prevConnectedStatus === 'not_connected'
      ? 'pending'
      : 'not_connected'));
  };

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  const createAsset = useCallback(async (interlinkerversion_id) => {
    setCreatingAsset(true)
    const data = await assetsApi.create(
      selectedTaskInstantiation.id,
      interlinkerversion_id
    );
    getCoproductionProcess()
    closeDialog()
    setCreatingAsset(false)
  }, [selectedTaskInstantiation]);

  const InterlinkerCard = ({ interlinker: {
    link,
    title,
    description,
    last_version: {
      id
    }
  } }) => {

    return (
      <Box sx={{ mt: 2, mb: 2 }}>
        <CardActionArea >
          <Card>
            <CardHeader
              avatar={
                <Avatar aria-label="recipe" src="https://simpatico.hi-iberia.es:4570/servicepedia/assets/logo_simpatico_small.png" />
              }
              title={title}
              subheader={description + "smdsa kfdms nd,ng dsfng ndsfmgn ndfgndsfmn"}
            />
            <Box sx={{ justifyContent: "space-evenly", p: 2, width: "100%" }}>
              <Button variant="text">
                Preview
              </Button>

              <LoadingButton
                loading={creatingAsset}
                loadingPosition="start"
                variant="outlined"
                onClick={() => {
                  createAsset(id)
                }}
              >
                Instantiate
              </LoadingButton>

            </Box>


          </Card>

        </CardActionArea>

      </Box>
    );
  };

  if (loading) {
    return <CircularProgress />;
  }

  const getTree = (phaseinstantiation) => phaseinstantiation.activityinstantiations.map((activityinstantiation, i) =>
    <Tree content={<span style={{ fontWeight: "bold" }}>{activityinstantiation.activity.name}</span>} key={activityinstantiation.id} open type="Activity" >
      {activityinstantiation.taskinstantiations.map(taskinstantiation =>
        <Tree open sx={{mb: 2}} content={
          <Alert
            severity={i % 2 ? "warning" : "success"}
            action={
              <>
                <Button color="inherit" size="small">
                  {i % 2 ? "Mark as completed" : "Mark as uncompleted"}
                </Button>
              </>
            }
          >
            {taskinstantiation.task.name}
          </Alert>
        } key={taskinstantiation.id} type="Task">
          <TableContainer sx={{ p: 1 }}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="assets table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Name</TableCell>
                  <TableCell align="center">Created at</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {taskinstantiation.assets.map(asset => {
                  const date = moment(asset.created_at);

                  return (
                    <TableRow
                      key={asset.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {asset.name}
                      </TableCell>
                      <TableCell align="center">{date.fromNow()}</TableCell>
                      <TableCell align="center"><Button variant="text" rel="noopener noreferrer" href={asset.link} target="_blank">Go</Button></TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>

            </Table>
          </TableContainer>
          <Button sx={{ mt: 1 }} variant="outlined" fullWidth startIcon={<AddIcon />} onClick={() => handleClickOpen(taskinstantiation)}>Add asset</Button>

        </Tree>
      )}
    </Tree>
  )

  const getDialog = () => <Dialog fullWidth maxWidth="lg" open={open} onClose={handleClose}>
    <DialogTitle>Asset creation</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Assets are created by interlinkers. Please, select one interlinker and an asset will be created.
      </DialogContentText>
      <Grid
        alignItems='center'
        container
        item
        justifyContent='flex-start'
        spacing={3}
        xs={12}
      >
        {selectedTaskInstantiation.task.interlinkers.map(interlinker =>
          <Grid item xs={12} md={6} lg={4} xl={3} key={interlinker.id} style={{ overflow: "hidden" }} sx={{ p: 1 }} >
            {<InterlinkerCard interlinker={interlinker} />}
          </Grid>
        )}
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>Cancel</Button>
      <Button onClick={handleClose}>Subscribe</Button>
    </DialogActions>
  </Dialog>

  return (
    <>
      <Helmet>
        <title>Dashboard: Social Profile</title>
      </Helmet>

      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%'
        }}
      >

        <Box
          style={{ backgroundImage: `url(${profile.cover})` }}
          sx={{
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            height: 90,
            position: 'relative',
            '&:before': {
              backgroundImage: 'linear-gradient(-180deg, rgba(0,0,0,0.00) 58%, rgba(0,0,0,0.32) 100%)',
              content: '" "',
              height: '100%',
              left: 0,
              position: 'absolute',
              top: 0,
              width: '100%'
            },
            '&:hover': {
              '& button': {
                visibility: 'visible'
              }
            }
          }}
        >
          <Button
            startIcon={<AddPhotoIcon fontSize='small' />}
            sx={{
              backgroundColor: blueGrey[900],
              bottom: {
                lg: 24,
                xs: 'auto'
              },
              color: 'common.white',
              position: 'absolute',
              right: 24,
              top: {
                lg: 'auto',
                xs: 24
              },
              visibility: 'hidden',
              '&:hover': {
                backgroundColor: blueGrey[900]
              }
            }}
            variant='contained'
          >
            Change Cover
          </Button>
        </Box>
        <Container maxWidth='xl'>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              mt: 1,
              position: 'relative'
            }}
          >
            <Avatar
              src=""
              sx={{
                border: (theme) => `4px solid ${theme.palette.background.default}`,
                height: 120,
                left: 24,
                position: 'absolute',
                top: -60,
                width: 120
              }}
            />
            <Box sx={{ ml: '160px' }}>
              <Typography
                color='textSecondary'
                variant='overline'
              >
                Coproduction process for
              </Typography>
              <Typography
                color='textPrimary'
                variant='h5'
              >
                {process && process.artefact.name}
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box
              sx={{
                display: {
                  md: 'block',
                  xs: 'none'
                }
              }}
            >
              <Button
                color='primary'
                onClick={handleConnectToggle}
                size='small'
                sx={{ ml: 1 }}
                variant='outlined'
              >
                Action 1
              </Button>
              <Button
                color='primary'
                onClick={handleConnectToggle}
                size='small'
                sx={{ ml: 1 }}
                variant='outlined'
              >
                Action 2
              </Button>
              <Button
                color='primary'
                component={RouterLink}
                size='small'
                sx={{ ml: 1 }}
                to='/dashboard/chat'
                variant='contained'
              >
                Action 3
              </Button>
            </Box>
            <Tooltip title='More options'>
              <IconButton sx={{ ml: 1 }}>
                <DotsVerticalIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          </Box>
        </Container>
        <Box sx={{ mt: 3 }}>
          <Container maxWidth='xl'>
            <Tabs
              indicatorColor='primary'
              onChange={handleTabsChange}
              scrollButtons='auto'
              textColor='primary'
              value={currentTab}
              variant='scrollable'
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.value}
                  label={tab.label}
                  value={tab.value}
                />
              ))}
            </Tabs>
            <Divider />

            <Card sx={{ p: 3, mt: 2 }}>

              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Phase</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={phase}
                  label="Phase"
                  sx={{ mb: 2 }}
                  onChange={(event) => {
                    setPhase(event.target.value);
                  }}
                >
                  {process && phaseinstantiations && phaseinstantiations.map((phaseinstantiation, i) =>
                    <MenuItem key={phaseinstantiation.id} value={phaseinstantiation.phase.name}>{phaseinstantiation.phase.name}</MenuItem>
                  )}
                </Select>
              </FormControl>

              {process && phase && phaseinstantiations && getTree(phaseinstantiations.find(el => el.phase.name === phase))}
              {process && phase && selectedTaskInstantiation && phaseinstantiations && getDialog(phaseinstantiations.find(el => el.phase.name === phase))}
            </Card>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default CoproductionProcessProfile;
