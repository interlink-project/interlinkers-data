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
  Breadcrumbs,
  TextField,
  Grid
} from '@material-ui/core';
import { coproductionProcessesApi } from '../../../__fakeApi__/processesApi';
import useMounted from '../../../hooks/useMounted';
import DotsVerticalIcon from '../../../icons/DotsVertical';
import gtm from '../../../lib/gtm';
import { NavigateNext } from '@material-ui/icons';
import WorkplanTab from './Workplan';
import GuideTab from './Guide';

const tabs = [
  { label: 'Overview', value: 'overview' },
  { label: 'Workplan', value: 'workplan' },
  { label: 'Guide', value: 'guide' },
  { label: 'Network', value: 'network' },
  { label: 'Repository', value: 'repository' },
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
  const mounted = useMounted();
  const [currentTab, setCurrentTab] = useState("overview");
  const [process, setProcess] = useState(null);
  const [processTree, setProcessTree] = useState(null);
  const [loading, setLoading] = useState(true);

  let { processId } = useParams();


  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getCoproductionProcess = useCallback(async () => {
    try {
      const data = await coproductionProcessesApi.get(processId)
      const treeData = await coproductionProcessesApi.getTree(processId)

      if (mounted.current) {
        setProcess(data);
        setProcessTree(treeData);
        setLoading(false)

      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  useEffect(() => {
    getCoproductionProcess();
  }, [getCoproductionProcess]);

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

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

        <Container maxWidth='xl'>
          <Breadcrumbs
            separator={<NavigateNext fontSize="small" />}
            aria-label="breadcrumb"
          >
            eo / eo /eo
          </Breadcrumbs>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              mt: 5,
              position: 'relative'
            }}
          >
            {loading ? <Skeleton variant="circular" sx={{
              border: (theme) => `4px solid ${theme.palette.background.default}`,
              height: 120,
              left: 24,
              position: 'absolute',
              width: 120
            }} /> : <Avatar
              src=""
              sx={{
                border: (theme) => `4px solid ${theme.palette.background.default}`,
                height: 120,
                left: 24,
                position: 'absolute',
                width: 120
              }}
            />}

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
                {loading ? <Skeleton /> : process.artefact.name}
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
                size='small'
                sx={{ ml: 1 }}
                variant='outlined'
              >
                Edit
              </Button>
              <Button
                color='primary'
                component={RouterLink}
                size='small'
                sx={{ ml: 1 }}
                to='/dashboard/chat'
                variant='contained'
              >
                Save
              </Button>
            </Box>
            <Tooltip title='More options'>
              <IconButton sx={{ ml: 1 }}>
                <DotsVerticalIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          </Box>
        </Container>
        <Box sx={{ mt: 5 }}>
          <Container maxWidth='xl'>
            <AppBar position="static" sx={{color: "white"}}>
              <Tabs
                indicatorColor="secondary"
                onChange={handleTabsChange}
                value={currentTab}
                centered
                textColor="inherit"
              >
                {tabs.map((tab) => (
                  <Tab
                    key={tab.value}
                    label={tab.label}
                    value={tab.value}
                  />
                ))}
              </Tabs>
            </AppBar>

            <Divider />
            <Card sx={{ paddingRight: 3, paddingLeft: 3, paddingBottom: 3, paddingTop: 1 }}>
              {loading ? <Skeleton variant="rectangular" width="100%">
                <div style={{ paddingTop: '57%' }} />
              </Skeleton> : <>
                <TabPanel value={currentTab} index="overview">
                  <TextField
                    fullWidth
                    disabled
                    id="filled-required"
                    label="Name of the project"
                    variant="filled"
                    sx={{ mt: 2 }}
                  />
                  <TextField
                    fullWidth
                    disabled
                    id="filled-required"
                    label="Short description of the project"
                    variant="filled"
                    sx={{ mt: 2 }}
                  />
                  <TextField
                    fullWidth
                    disabled
                    id="filled-required"
                    label="Aim of the project"
                    variant="filled"
                    sx={{ mt: 2 }}
                  />
                </TabPanel>
                <TabPanel value={currentTab} index="workplan">
                  <WorkplanTab coproductionprocess={process} processTree={processTree} />
                </TabPanel>
                <TabPanel value={currentTab} index="guide">
                  <GuideTab coproductionprocess={process} processTree={processTree} />
                </TabPanel>
              </>}

            </Card>


          </Container>
        </Box>
      </Box>
    </>
  );
};

export default CoproductionProcessProfile;
