import { useCallback, useState, useEffect } from 'react';

import { Link as RouterLink, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Tab,
  AppBar,
  Tabs,
  Tooltip,
  Typography,
  Card,
  Skeleton,
  CardHeader,
  TextField,
  Grid,
  useMediaQuery,
  useTheme,
  
} from '@material-ui/core';
import useMounted from '../../../hooks/useMounted';
import DotsVerticalIcon from '../../../icons/DotsVertical';
import gtm from '../../../lib/gtm';
import { MoreVert, NavigateNext } from '@material-ui/icons';
import Repository from './Tabs/Repository/Repository';
import MobileRepository from './Tabs/Repository/MobileRepository';
import Workplan from './Tabs/Workplan/Workplan';
import Network from './Tabs/Network';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getProcess } from '../../../slices/process';
import { red } from '@material-ui/core/colors';

const tabs = [
  { label: 'Overview', value: 'overview' },
  { label: 'Workplan', value: 'workplan' },
  { label: 'Repository', value: 'repository' },
  { label: 'Network', value: 'network' },
  { label: 'Forum', value: 'forum' },
  { label: 'Settings', value: 'settings' },
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`coproduction-process-tab-${index}`}
      aria-labelledby={`coproduction-process-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

const CoproductionProcessProfile = () => {
  let { processId, tab } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mounted = useMounted();

  const [currentTab, setCurrentTab] = useState(tab || "overview");
  const { process, loading } = useSelector((state) => state.process);


  const theme = useTheme();
  const onMobile = !useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getCoproductionProcess = useCallback(async () => {
    try {
      if (mounted.current) {
        dispatch(getProcess(processId))
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  useEffect(() => {
    getCoproductionProcess();
  }, [getCoproductionProcess]);

  useEffect(() => {
    navigate(`/dashboard/coproductionprocesses/${processId}/${currentTab}`);
  }, [currentTab]);

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };



  const Tabss = () => <Card sx={{ mr: onMobile ? 0 : 2, mb: onMobile ? 1: 0 }}>
  <CardHeader
    avatar={
      <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
        {process && process.artefact.name[0]}
      </Avatar>
    }
    action={
      <IconButton aria-label="settings">
        <MoreVert />
      </IconButton>
    }
    title={process && process.artefact.name}
    subheader={process && process.artefact.artefact_type}
  /><Tabs
    indicatorColor="secondary"
    onChange={handleTabsChange}
    value={currentTab}
    variant="scrollable"
    scrollButtons="auto"

    orientation={onMobile ? "horizontal" : "vertical"}
    aria-label="Coproduction tabs"
  >
    {tabs.map((tab) => (
      <Tab
        key={tab.value}
        label={tab.label}
        value={tab.value}
        sx={{mb: onMobile ? 0: 1}}
      />
    ))}
  </Tabs></Card>

  const Content = () => <Card >
    <TabPanel value={currentTab} index="overview">
      <div style={{minHeight: "85vh" }}>
      <TextField
        fullWidth
        disabled
        id="filled-required"
        label="Name of the project"
        variant="filled"
        sx={{ m: 2 }}
      />
      <TextField
        fullWidth
        disabled
        id="filled-required"
        label="Short description of the project"
        variant="filled"
        sx={{ m: 2 }}
      />
      <TextField
        fullWidth
        disabled
        id="filled-required"
        label="Aim of the project"
        variant="filled"
        sx={{ m: 2 }}
      />
      </div>
    </TabPanel>
    <TabPanel value={currentTab} index="workplan">
      <Workplan />
    </TabPanel>
    <TabPanel value={currentTab} index="repository">
    <Repository />
    </TabPanel>
    <TabPanel value={currentTab} index="network">
      <Network />
    </TabPanel>


  </Card>

  const ContentSkeleton = () => loading || !process ? <Skeleton variant="rectangular" width="100%">
    <div style={{ paddingTop: '57%' }} />
  </Skeleton> : <Content />
  return (
    <>
      <Helmet>
        <title>Dashboard: Coproduction process</title>
      </Helmet>

      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%'
        }}
      >
        <Box sx={{ mt: 5 }}>
          <Container maxWidth='xl'>
            {onMobile ?
              <>
                <Tabss />
                <ContentSkeleton />
              </>
              :
              <Grid container>
                <Grid item xl={2} lg={2} md={2} xs={2}>
                  <Tabss />
                </Grid>
                <Grid item xl={10} lg={10} md={10} xs={10}>
                  <ContentSkeleton />
                </Grid>
              </Grid>
            }

          </Container>
        </Box>
      </Box>
    </>
  );
};

export default CoproductionProcessProfile;
