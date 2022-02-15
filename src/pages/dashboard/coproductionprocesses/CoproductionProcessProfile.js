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
import TeamTab from './Tabs/Team';
import Workplan from './Tabs/Workplan/Workplan';
import Forum from './Tabs/Forum';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getProcess } from 'slices/process';
import { red } from '@material-ui/core/colors';
import OverviewTab from 'pages/dashboard/coproductionprocesses/Tabs/Overview';
import MainSkeleton from 'pages/dashboard/coproductionprocesses/Tabs/MainSkeleton';
import { getImageUrl } from 'axiosInstance';

const tabs = [
  { label: 'Repository', value: 'repository' },
  { label: 'Overview', value: 'overview' },
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

const CoproductionProcessProfile = () => {
  let { processId, tab = "repository" } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mounted = useMounted();

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

  const handleTabsChange = (event, value) => {
    navigate(`/dashboard/coproductionprocesses/${processId}/${value}`);
  };


  const logoExists = process && process.logotype
  const TabsMobile = () => <Card sx={{ mr: onMobile ? 0 : 2, mb: onMobile ? 1 : 0 }}>
    <CardHeader
      avatar={
        <Avatar variant="square" sx={logoExists ? {} : { bgcolor: red[500] }} aria-label="recipe" src={logoExists && getImageUrl("coproduction", process.logotype)}>
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
    /><Tabs
      indicatorColor="secondary"
      onChange={handleTabsChange}
      value={tab}
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
          sx={{ mb: onMobile ? 0 : 1 }}
        />
      ))}
    </Tabs></Card>

  const Content = () => <>
    <TabPanel value={tab} index="repository">
      <Card>
        <Repository />
      </Card>
    </TabPanel>
    <TabPanel value={tab} index="overview">
      <Card >
        <OverviewTab />
      </Card>
    </TabPanel>
    <TabPanel value={tab} index="team">
      <TeamTab />
    </TabPanel>
  </>


  const ContentSkeleton = () => loading || !process ? <MainSkeleton /> : <Content />
  return (
    <>
      <Helmet>
        <title>Dashboard: Coproduction process</title>
      </Helmet>

      <Box
        sx={{
          backgroundColor: 'background.default',
        }}
      >
        <Box sx={{ mt: 5 }}>
          <Container maxWidth='xl'>
            {onMobile ?
              <>
                <TabsMobile />
                <ContentSkeleton />
              </>
              :
              <ContentSkeleton />
            }

          </Container>
        </Box>
      </Box>
    </>
  );
};

export default CoproductionProcessProfile;
