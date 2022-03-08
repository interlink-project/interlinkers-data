import {
  Box, Card, Divider, Tab,
  Tabs
} from '@material-ui/core';
import {
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
    { label: 'Instructions', value: 'instructions' },
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
      
      <Box sx={{ mt: 3}} >
        {currentTab === 'overview' && (
          <InterlinkerOverview interlinker={interlinker} />
        )}
        {currentTab === 'instructions' && (
          <Card sx={{p: 3, height: "100%" }}>
            <SafeHTMLElement data={interlinker.instructions} />
          </Card>
        )}
        {currentTab === 'related' && (
          <RelatedInterlinkersTable interlinker={interlinker} />
        )}
        {currentTab === 'snapshots' && (
          <Card>
            <SwipeableTextMobileStepper height="60vh" images={interlinker.snapshots_links} objectFit="contain" />
          </Card>
        )}
        {currentTab === 'reviews' && (
          <InterlinkerReviews interlinker={interlinker} />
        )}

      </Box>
    </>
  );
};

export default InterlinkerDetails;
