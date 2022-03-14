import {
  Box, Card, CardContent, Chip, Divider, Grid, Tab, Tabs, Typography
} from '@material-ui/core';
import { NatureChip, OfficialityChip } from 'components/dashboard/assets/Icons';
import {
  InterlinkerReference,
  InterlinkerReviews
} from 'components/dashboard/interlinkers';
import SwipeableTextMobileStepper from 'components/dashboard/interlinkers/browse/Carousel';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { SafeHTMLElement } from 'utils/safeHTML';
import RelatedInterlinkersTable from "./RelatedInterlinkersTable";

const InterlinkerDetails = ({ interlinker }) => {
  const [currentTab, setCurrentTab] = useState('overview');

  const { link, description, tags, name, problemprofiles, softwareinterlinker } = interlinker;
  const navigate = useNavigate();

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

      <Box sx={{ mt: 3 }} >
        {currentTab === 'overview' && (
          <Card sx={{ height: "100%" }}>
            <CardContent>

              <Grid container spacing={3}>

                <Grid item xs={12} md={6} lg={6} xl={6}
                >
                  <Typography
                    color='textSecondary'
                    variant='overline'
                  >
                    Name
                  </Typography>
                  <Typography
                    color='textPrimary'
                    variant='subtitle2'
                  >
                    {name}
                  </Typography>
                </Grid>


                <Grid item xs={12} md={3} lg={3} xl={3}
                >
                  <Typography
                    color='textSecondary'
                    variant='overline'
                  >
                    Nature
                  </Typography>
                  <br></br>
                  <NatureChip nature={interlinker.nature} />

                </Grid>
                <Grid item xs={12} md={3} lg={3} xl={3}
                >
                  <Typography
                    color='textSecondary'
                    variant='overline'
                  >
                    Creator
                  </Typography>
                  <br></br>
                  <OfficialityChip />
                </Grid>
                <Grid item xs={12} md={6} lg={6} xl={6}
                >
                  <Typography
                    color='textSecondary'
                    variant='overline'
                  >
                    Description
                  </Typography>
                  <SafeHTMLElement data={description} />
                </Grid>
                <Grid item xs={12} md={6} lg={6} xl={6}
                >
                  <Typography
                    color='textSecondary'
                    variant='overline'
                  >
                    Tags
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        variant='outlined'
                      />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12} md={6} lg={6} xl={6}
                >
                  <Typography
                    color='textSecondary'
                    variant='overline'
                  >
                    Problem profiles
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {problemprofiles.map((problem) => (
                      <Chip
                        key={problem.id}
                        label={problem.name}
                        variant='outlined'
                      />
                    ))}
                  </Box>
                </Grid>

                {softwareinterlinker && <Grid item xs={12} md={6} lg={6} xl={6}
                >
                  <Typography
                    color='textSecondary'
                    variant='overline'
                  >
                    Based on
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <InterlinkerReference interlinker={softwareinterlinker} />
                  </Box>
                </Grid>}
              </Grid>

            </CardContent>
          </Card>
        )}
        {currentTab === 'instructions' && (
          <Card sx={{ p: 3, height: "100%" }}>
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
