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
  Tabs,
  Tooltip,
  Typography,
  Card,
  Skeleton,
} from '@material-ui/core';
import { coproductionProcessesApi } from '../../../__fakeApi__/processesApi';
import useMounted from '../../../hooks/useMounted';
import DotsVerticalIcon from '../../../icons/DotsVertical';
import gtm from '../../../lib/gtm';
import TreeView from "./TreeView"

const tabs = [
  { label: 'Guide', value: 'guide' },
  { label: 'Overview', value: 'overview' }
];

const CoproductionProcessProfile = () => {
  const mounted = useMounted();
  const [currentTab, setCurrentTab] = useState('guide');
  const [process, setProcess] = useState(null);
  const [loading, setLoading] = useState(true);

  let { processId } = useParams();


  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getCoproductionProcess = useCallback(async () => {
    try {
      const data = await coproductionProcessesApi.get(processId)

      if (mounted.current) {
        setProcess(data);
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
                Action 1
              </Button>
              <Button
                color='primary'
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
              {loading ? <Skeleton variant="rectangular" width="100%">
                <div style={{ paddingTop: '57%' }} />
              </Skeleton> :
                <>
                  {currentTab === "guide" && <>
                    <TreeView phaseinstantiations={process.phaseinstantiations} />
                  </>}
                </>
              }
            </Card>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default CoproductionProcessProfile;
