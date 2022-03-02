import {
  Box, Card, Divider, Tab,
  Tabs
} from '@material-ui/core';
import {
  InterlinkerAssets,
  InterlinkerOverview,
  InterlinkerReviews
} from 'components/dashboard/interlinkers';
import { subHours } from 'date-fns';
import { useState } from 'react';
import RelatedInterlinkersTable from "./RelatedInterlinkersTable";
import SwipeableTextMobileStepper from 'components/dashboard/interlinkers/browse/Carousel';
import { SafeHTMLElement } from 'utils/safeHTML';

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

  const common = [
    { label: 'Overview', value: 'overview' },
    { label: 'Reviews', value: 'reviews' },
    { label: 'Snapshots', value: 'snapshots' },
    { label: 'Related interlinkers', value: 'related' },
  ]
  const tabs = isKnowledge ? [
    ...common,
  ] : [
    ...common
  ]

  return (
    <>
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
        <Divider />
      
      <Box sx={{ mt: 3 }} >
        {currentTab === 'overview' && (
          <InterlinkerOverview interlinker={interlinker} />
        )}
        {currentTab === 'related' && (
          <RelatedInterlinkersTable interlinker={interlinker} />
        )}
        {currentTab === 'snapshots' && (
          <Card>
            <SwipeableTextMobileStepper images={interlinker.snapshots} />
          </Card>
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
    </>
  );
};

export default InterlinkerDetails;
