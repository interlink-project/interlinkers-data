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
import useMounted from '../../../hooks/useMounted';
import DotsVerticalIcon from '../../../icons/DotsVertical';
import gtm from '../../../lib/gtm';
import { NavigateNext } from '@material-ui/icons';
import Repository from './Tabs/Repository/Repository';
import Workplan from './Tabs/Workplan/Workplan';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getProcess } from '../../../slices/process';

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
  const { process, tree, loading } = useSelector((state) => state.process);

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
            {loading || !process ?  <Skeleton variant="circular" sx={{
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
                {loading || !process ?  <Skeleton /> : process.artefact.name}
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
            <Grid container>

              <Grid item xl={2} lg={2} md={2} xs={2}>

                <Tabs
                  indicatorColor="secondary"
                  onChange={handleTabsChange}
                  value={currentTab}
                  variant="scrollable"
                  scrollButtons="auto"

                  orientation="vertical"
                  aria-label="Coproduction tabs"
                  sx={{ borderRight: 1, borderColor: 'divider' }}
                >
                  {tabs.map((tab) => (
                    <Tab
                      key={tab.value}
                      label={tab.label}
                      value={tab.value}
                    />
                  ))}
                </Tabs>

              </Grid>
              <Grid item xl={10} lg={10} md={10} xs={10}>
                {loading || !process ?  <Skeleton variant="rectangular" width="100%">
                  <div style={{ paddingTop: '57%' }} />
                </Skeleton> : <Card >
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
                    <Workplan processTree={tree} />
                  </TabPanel>
                  <TabPanel value={currentTab} index="repository">
                    <Repository />
                  </TabPanel>


                </Card>
                }
              </Grid>
            </Grid>


          </Container>
        </Box>
      </Box>
    </>
  );
};

export default CoproductionProcessProfile;
