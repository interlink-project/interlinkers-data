import {
  Box, Card, CardContent, Chip, Divider, Grid, Tab, Tabs, Typography, Button, Paper, Stack
} from '@material-ui/core';
import { NatureChip, OfficialityChip } from 'components/dashboard/assets/Icons';
import SwipeableTextMobileStepper from 'components/dashboard/interlinkers/browse/Carousel';
import useMounted from 'hooks/useMounted';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { SafeHTMLElement } from 'utils/safeHTML';
import { useParams } from 'react-router-dom';
import { getTeam } from 'slices/team';

const TeamProfile = () => {
  let { teamId, tab = "overview" } = useParams();
  const [currentTab, setCurrentTab] = useState('overview');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mounted = useMounted();
  const { team, loading } = useSelector((state) => state.team);

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  

  const tabs = [
    { label: 'Overview', value: 'overview' },
    { label: 'Instructions', value: 'instructions' },
    { label: 'Reviews', value: 'reviews' },
    { label: 'Related interlinkers', value: 'related' },
  ]

  const getTeamOnInit = useCallback(async () => {
    try {

      if (mounted.current) {
        dispatch(getTeam(teamId))
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted, teamId]);

  useEffect(() => {
    getTeamOnInit();
  }, [getTeamOnInit]);

  console.log(team)

  if (!team) {
    return null;
  }

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
              
            </Grid>

          
          </Grid>
        )}

      </Box>
    </>
  );
};

export default TeamProfile;
