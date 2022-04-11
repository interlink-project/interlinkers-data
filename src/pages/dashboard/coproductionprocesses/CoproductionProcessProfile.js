import {
  Avatar,
  Box, Card, CardHeader, Container, IconButton,
  Tab, Tabs, useMediaQuery,
  useTheme
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { MoreVert } from '@material-ui/icons';
import MainSkeleton from 'pages/dashboard/coproductionprocesses/Tabs/MainSkeleton';
import OverviewTab from 'pages/dashboard/coproductionprocesses/Tabs/Overview';
import { useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import { getSchemas, getSoftwareInterlinkers } from 'slices/general';
import { getProcess, setSelectedTreeItem } from 'slices/process';
import useMounted from '../../../hooks/useMounted';
import MetadataTab from './Tabs/Metadata';
import CreateSchema from './Tabs/Repository/CreateSchema';
import Repository from './Tabs/Repository/Repository';
import TeamTab from './Tabs/Team';
import Workplan from './Tabs/Workplan/Workplan';


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

const style = {
  mb: '30px',
  minHeight: '87vh'

}


const TabsMobile = ({ tab, process }) => {
  const logoExists = process && process.logotype_link
  const navigate = useNavigate();

  return process && <Card sx={{ mb: 1 }}>
    <CardHeader
      avatar={
        <Avatar variant="square" sx={logoExists ? {} : { bgcolor: red[500] }} aria-label="recipe" src={logoExists && process.logotype_link}>
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

  const _setSelectedTreeItem = (item, callback) => {
    dispatch(setSelectedTreeItem(item, callback))
  }

  const getCoproductionProcess = useCallback(async () => {
    try {

      if (mounted.current) {
        dispatch(getProcess(processId))
        dispatch(getSoftwareInterlinkers())
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
            {loading || !process ? <MainSkeleton /> :
              <>
                <TabPanel value={tab} index="overview">
                  <Card sx={style}>
                    <OverviewTab setSelectedTreeItem={_setSelectedTreeItem} coproductionprocess={process} />
                  </Card>
                </TabPanel>
                <TabPanel value={tab} index="metadata">
                  <Card >
                    <MetadataTab />
                  </Card>
                </TabPanel>
                <TabPanel value={tab} index="workplan">
                  <Card sx={style}>
                    {process.phases_count > 0 ? <Workplan setSelectedTreeItem={_setSelectedTreeItem} /> : <CreateSchema />}
                  </Card>
                </TabPanel>
                <TabPanel value={tab} index="guide">
                  <Card sx={style}>
                    {process.phases_count > 0 ? <Repository setSelectedTreeItem={_setSelectedTreeItem} /> : <CreateSchema />}
                  </Card>
                </TabPanel>
                <TabPanel value={tab} index="team">
                  <TeamTab />
                </TabPanel>
              </>
            }
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default CoproductionProcessProfile;
