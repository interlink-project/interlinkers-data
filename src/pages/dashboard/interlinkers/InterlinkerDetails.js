import {
  Box, Card, CardContent, Chip, Divider, Grid, Tab, Tabs, Typography, Button, Paper, Stack
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

  const { link, description, tags, name, problemprofiles, softwareinterlinker, snapshots_links } = interlinker;
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
    { label: 'Instructions', value: 'instructions' },
    { label: 'Reviews', value: 'reviews' },
    { label: 'Related interlinkers', value: 'related' },
  ]
  const tabs = isKnowledge ? [
    ...common,
    { label: 'Preview', value: 'preview' },
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
          <Grid container spacing={3}>
            <Grid item xs={12} md={5} lg={5} xl={5}
            >
              <Paper>
                <SwipeableTextMobileStepper height="50vh" images={snapshots_links} objectFit="contain" />

              </Paper>
            </Grid>

            <Grid item xs={12} md={7} lg={7} xl={7}
            >
              <Card >
                <CardContent sx={{ minHeight: "55vh", overflowY: "scroll" }}>
                  <Stack direction="column" spacing={1}>
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

                    <Typography
                      color='textSecondary'
                      variant='overline'
                    >
                      Nature
                    </Typography>
                    <NatureChip nature={interlinker.nature} />
                    <Typography
                      color='textSecondary'
                      variant='overline'
                    >
                      Creator
                    </Typography>
                    <OfficialityChip />
                    <Typography
                      color='textSecondary'
                      variant='overline'
                    >
                      Tags
                    </Typography>
                    <Box>
                      {tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          sx={{ m: 1 }}
                          variant='outlined'
                        />
                      ))}
                    </Box>
                    <Typography
                      color='textSecondary'
                      variant='overline'
                    >
                      Problem profiles
                    </Typography>
                    <Box>
                      {problemprofiles.map((problem) => (
                        <Chip
                          key={problem.id}
                          label={problem.name}
                          title={problem.id}
                          variant='outlined'
                          sx={{ m: 1 }}
                        />
                      ))}
                    </Box>

                    {softwareinterlinker && <>
                      <Typography
                        color='textSecondary'
                        variant='overline'
                      >
                        Based on
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <InterlinkerReference interlinker_id={softwareinterlinker.id} />
                      </Box>
                    </>}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
        {currentTab === 'instructions' && (
          <Card sx={{ p: 3, height: "100%" }}>

            <Typography
              color='textSecondary'
              variant='overline'
            >
              Description
            </Typography>
            <SafeHTMLElement data={description} />
            <Typography
              color='textSecondary'
              variant='overline'
            >
              Instructions
            </Typography>
            <SafeHTMLElement data={interlinker.instructions} />
          </Card>
        )}
        {currentTab === 'preview' && isKnowledge && (

          <Box
            style={{
              position: 'absolute', left: '50%', top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <Box sx={{ mt: 2 }}>
              <Typography
                align='center'
                color='textPrimary'
                variant='h5'
              >
                This resource cannot be displayed here. Instead...
              </Typography>
            </Box>
            {softwareinterlinker.integration && softwareinterlinker.integration.preview && <>
              <Box sx={{ mt: 2 }}>
                <Typography
                  align='center'
                  color='textSecondary'
                  variant='subtitle1'
                >
                  you can preview the resource externally
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 2,
                }}
              >
                <Button
                  color='primary'
                  variant='contained'
                  onClick={() => window.open(interlinker.link + "/preview", "_blank")}
                >
                  {softwareinterlinker.integration.preview_text || "Preview resource externally"}
                </Button>
              </Box>
            </>}

            {softwareinterlinker.integration && !softwareinterlinker.integration.preview && softwareinterlinker.integration.download && <>
              <Box sx={{ mt: 2 }}>
                <Typography
                  align='center'
                  color='textSecondary'
                  variant='subtitle1'
                >
                  you can download a copy of it to preview it on your machine
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 2,
                }}
              >
                <Button
                  color='primary'
                  variant='contained'
                  onClick={() => window.open(interlinker.link + "/download", "_blank")}
                >
                  {softwareinterlinker.integration.download_text || "Download resource"}
                </Button>
              </Box>
            </>}
          </Box>






        )}
        {currentTab === 'related' && (
          <RelatedInterlinkersTable interlinker={interlinker} />
        )}
        {currentTab === 'reviews' && (
          <InterlinkerReviews interlinker={interlinker} />
        )}

      </Box>
    </>
  );
};

export default InterlinkerDetails;
