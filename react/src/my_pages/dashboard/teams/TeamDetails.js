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
import { teamApi } from '../../../__fakeApi__/teamApi';
import {
  TeamActivities,
  TeamApplicants,
  TeamApplicationModal,
  TeamAssets,
  TeamOverview,
  TeamReviews,
} from '../../../my_components/dashboard/teams';
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

const TeamDetails = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [currentTab, setCurrentTab] = useState('overview');
  const [team, setTeam] = useState(null);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getTeam = useCallback(async () => {
    try {
      const data = await teamApi.getTeam();

      if (mounted.current) {
        setTeam(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  useEffect(() => {
    getTeam();
  }, [getTeam]);

  const handleApplyModalOpen = () => {
    setIsApplicationOpen(true);
  };

  const handleApplyModalClose = () => {
    setIsApplicationOpen(false);
  };

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  if (!team) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard: Team Details</title>
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
                {team.title}
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
              <TeamOverview team={team} />
            )}
            {currentTab === 'assets' && (
              <TeamAssets team={team} />
            )}
            {currentTab === 'reviews' && (
              <TeamReviews reviews={team.reviews} />
            )}
            {currentTab === 'activity' && (
              <TeamActivities activities={team.activities} />
            )}
            {currentTab === 'applicants' && (
              <TeamApplicants applicants={team.applicants} />
            )}
          </Box>
        </Container>
      </Box>
      <TeamApplicationModal
        authorAvatar={team.author.avatar}
        authorName={team.author.name}
        onApply={handleApplyModalClose}
        onClose={handleApplyModalClose}
        open={isApplicationOpen}
      />
    </>
  );
};

export default TeamDetails;
