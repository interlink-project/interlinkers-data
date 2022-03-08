import { useCallback, useState, useEffect } from 'react';

import { Link, Link as RouterLink, useParams } from 'react-router-dom';
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
  TabClassKey,
  Skeleton,
  CardHeader,
  Breadcrumbs,
  useMediaQuery,
  useTheme,

} from '@material-ui/core';
import useMounted from '../../../hooks/useMounted';
import DotsVerticalIcon from '../../../icons/DotsVertical';
import { Grain, Home, MoreVert, NavigateNext, Whatshot } from '@material-ui/icons';
import Repository from './Tabs/Repository/Repository';
import CreateSchema from './Tabs/Repository/CreateSchema';
import MobileRepository from './Tabs/Repository/MobileRepository';
import TeamTab from './Tabs/Team';
import Workplan from './Tabs/Workplan/Workplan';
import Forum from './Tabs/Forum';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getProcess } from 'slices/process';
import { red } from '@material-ui/core/colors';
import OverviewTab from 'pages/dashboard/coproductionprocesses/Tabs/Overview';
import MainSkeleton from 'pages/dashboard/coproductionprocesses/Tabs/MainSkeleton';
import MetadataTab from './Tabs/Metadata';

const tabs = [
  { label: 'Overview', value: 'overview' },
  { label: 'Metadata', value: 'metadata' },
  { label: 'Workplan', value: 'workplan' },
  { label: 'Guide', value: 'guide' },
  { label: 'Team', value: 'team' },
];

/*{ label: 'Workplan', value: 'workplan' },
  { label: 'Network', value: 'network' },
  { label: 'Forum', value: 'forum' },
  { label: 'Settings', value: 'settings' },*/



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

const Content = ({ tab, process }) => <>

  <TabPanel value={tab} index="overview">
    <Card >
      <OverviewTab coproductionprocess={process} />
    </Card>
  </TabPanel>
  <TabPanel value={tab} index="metadata">
    <Card >
      <MetadataTab />
    </Card>
  </TabPanel>
  <TabPanel value={tab} index="workplan">
    <Card sx={{ mb: 2 }}>
      {process.phases_count > 0 ? <Workplan /> : <CreateSchema />}
    </Card>
  </TabPanel>
  <TabPanel value={tab} index="guide">
    <Card sx={{ mb: 2 }}>
      {process.phases_count > 0 ? <Repository /> : <CreateSchema />}
    </Card>
  </TabPanel>
  <TabPanel value={tab} index="team">
    <TeamTab />
  </TabPanel>
</>

const TabsMobile = ({ tab, process }) => {
  const logoExists = process && process.logotype
  const navigate = useNavigate();

  return process && <Card sx={{ mb: 1 }}>
    <CardHeader
      avatar={
        <Avatar variant="square" sx={logoExists ? {} : { bgcolor: red[500] }} aria-label="recipe" src={logoExists && process.logotype}>
          {process && !logoExists && process.name[0]}
        </Avatar>
      }
      action={
        <IconButton aria-label="settings">
          <MoreVert />
        </IconButton>
      }
      title={process && process.name}
      subheader={process && process.artefact_type}
    />
    <Tabs
      indicatorColor="secondary"
      onChange={(value) => navigate(`/dashboard/coproductionprocesses/${process.id}/${value}`)}
      value={tab}
      aria-label="Coproduction tabs"
      centered
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.value}
          label={tab.label}
          value={tab.value}
        />
      ))}
    </Tabs>
  </Card>
}

const CoproductionProcessProfile = () => {
  let { processId, tab = "overview" } = useParams();
  const dispatch = useDispatch();
  const mounted = useMounted();

  const { process, loading } = useSelector((state) => state.process);

  const theme = useTheme();
  const onMobile = !useMediaQuery(theme.breakpoints.up('md'));

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


  return (
    <>
      <Helmet>
        <title>Dashboard: Co-production process</title>
      </Helmet>

      <Box
        sx={{
          backgroundColor: 'background.default',
        }}
      >
        <Box sx={{ mt: 5 }}>
          <Container maxWidth='xl'>
            {onMobile && <TabsMobile tab={tab} process={process} />}
            {loading || !process ? <MainSkeleton /> : <Content tab={tab} process={process} />}
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default CoproductionProcessProfile;
