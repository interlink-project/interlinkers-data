import {
    Avatar,
    Box,
    Button,
    Container,
    Divider,
    Grid,
    Tab,
    Tabs,
    Typography
  } from '@material-ui/core';
  import {
    InterlinkerAssets,
    InterlinkerOverview,
    InterlinkerReviews
  } from 'components/dashboard/interlinkers';
  import { subHours } from 'date-fns';
  import ShareIcon from 'icons/Share';
  import { useState } from 'react';
  import { Helmet } from 'react-helmet-async';
  import { SafeHTMLElement } from 'utils/safeHTML';
  import RelatedInterlinkersTable from "./RelatedInterlinkersTable"
  
  const now = new Date();
  
  
  const InterlinkerDetails = ({ interlinker }) => {
    const [currentTab, setCurrentTab] = useState('overview');
    
    const handleTabsChange = (event, value) => {
      setCurrentTab(value);
    };
  
    if (!interlinker) {
      return null;
    }
  
    const isKnowledge = interlinker.nature === "knowledgeinterlinker"
  
    const tabs = isKnowledge ? [
      { label: 'Overview', value: 'overview' },
      { label: 'Reviews', value: 'reviews' },
      { label: 'Related interlinkers', value: 'related' },
    ] : [
      { label: 'Overview', value: 'overview' },
      { label: 'Reviews', value: 'reviews' },
    ]
  
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
          <Container maxWidth="lg">
            
            <Box sx={{ mt: 3 }}>
              <Tabs
                indicatorColor='primary'
                onChange={handleTabsChange}
                scrollButtons='auto'
                textColor='primary'
                value={currentTab}
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
            <Box sx={{ mt: 3 }} >
              {currentTab === 'overview' && (
                <InterlinkerOverview interlinker={interlinker} />
              )}
              {currentTab === 'related' && (
                <RelatedInterlinkersTable interlinker={interlinker} />
              )}
              {currentTab === 'assets' && (
                <InterlinkerAssets interlinker={interlinker} />
              )}
              {currentTab === 'reviews' && (
                <InterlinkerReviews reviews={[
                  {
                    id: '5f0366cd843161f193ebadd4',
                    author: {
                      avatar: '/static/mock-images/avatars/avatar-marcus_finn.png',
                      name: 'Marcus Finn',
                    },
                    comment: 'Great information.',
                    createdAt: subHours(now, 2).getTime(),
                    value: 5,
                  },
                  {
                    id: 'to33twsyjphcfj55y3t07261',
                    author: {
                      avatar: '/static/mock-images/avatars/avatar-miron_vitold.png',
                      name: 'Miron Vitold',
                    },
                    comment:
                      "Not the best for this kind of task.",
                    createdAt: subHours(now, 2).getTime(),
                    value: 2,
                  },
                ]} />
              )}
  
            </Box>
          </Container>
        </Box>
  
      </>
    );
  };
  
  export default InterlinkerDetails;
  