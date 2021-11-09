import { useCallback, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { formatDistanceToNowStrict } from 'date-fns';
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { interlinkerApi } from '../../../__fakeApi__/interlinkerApi';
import {
  InterlinkerActivities,
  InterlinkerApplicants,
  InterlinkerApplicationModal,
  InterlinkerAssets,
  InterlinkerOverview,
  InterlinkerReviews,
} from '../../../components/dashboard/interlinkers';
import useMounted from '../../../hooks/useMounted';
import useSettings from '../../../hooks/useSettings';
import ShareIcon from '../../../icons/Share';
import gtm from '../../../lib/gtm';

const tabs = [
  { label: 'Overview', value: 'overview' },
  { label: 'Assets', value: 'assets' },
  { label: 'Reviews', value: 'reviews' },
  { label: 'Activity', value: 'activity' },
  { label: 'Applicants', value: 'applicants' },
];

const InterlinkerDetails = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [currentTab, setCurrentTab] = useState('overview');
  const [interlinker, setInterlinker] = useState(null);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getInterlinker = useCallback(async () => {
    try {
      const data = await interlinkerApi.getInterlinker();

      if (mounted.current) {
        setInterlinker(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  useEffect(() => {
    getInterlinker();
  }, [getInterlinker]);

  const handleApplyModalOpen = () => {
    setIsApplicationOpen(true);
  };

  const handleApplyModalClose = () => {
    setIsApplicationOpen(false);
  };

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  if (!interlinker) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard: Interlinker Details</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8,
        }}
      >
        <Container>
          <Grid
            container
            justifyContent='space-between'
            spacing={3}
          >
            <Grid item>
              <Typography
                color='textPrimary'
                variant='h5'
              >
                {interlinker.title}
                {' '}
                <Typography
                  color='textPrimary'
                  variant='overline'
                >
                  (Catalogue)
                </Typography>
              </Typography>

            </Grid>
            <Grid item>
              <Box sx={{ m: -1 }}>
                <Button
                  color='primary'
                  startIcon={<ShareIcon fontSize='small' />}
                  sx={{ m: 1 }}
                  variant='text'
                >
                  Share
                </Button>
                <Button
                  color='primary'
                  onClick={handleApplyModalOpen}
                  startIcon={<SendIcon fontSize='small' />}
                  sx={{ m: 1 }}
                  variant='contained'
                >
                  Apply for a role
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <Tabs
              indicatorColor='primary'
              onChange={handleTabsChange}
              scrollButtons='auto'
              textColor='primary'
              value={currentTab}
              variant='scrollable'
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
          </Box>
          <Divider />
          <Box sx={{ mt: 3 }}>
            {currentTab === 'overview' && (
              <InterlinkerOverview interlinker={interlinker} />
            )}
            {currentTab === 'assets' && (
              <InterlinkerAssets interlinker={interlinker} />
            )}
            {currentTab === 'reviews' && (
              <InterlinkerReviews reviews={interlinker.reviews} />
            )}
            {currentTab === 'activity' && (
              <InterlinkerActivities activities={interlinker.activities} />
            )}
            {currentTab === 'applicants' && (
              <InterlinkerApplicants applicants={interlinker.applicants} />
            )}
          </Box>
        </Container>
      </Box>
      <InterlinkerApplicationModal
        authorAvatar={interlinker.author.avatar}
        authorName={interlinker.author.name}
        onApply={handleApplyModalClose}
        onClose={handleApplyModalClose}
        open={isApplicationOpen}
      />
    </>
  );
};

export default InterlinkerDetails;
