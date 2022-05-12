import { Box, Grid } from '@material-ui/core';
import { PhaseTabs, StyledTree } from 'components/dashboard/tree';
import useMounted from 'hooks/useMounted';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setselectedPhaseTabId } from 'slices/process';
import RightSide from './RightSide';

const Repository = ({ setSelectedTreeItem }) => {
  const dispatch = useDispatch();
  const mounted = useMounted();

  const { selectedPhaseTabId, selectedTreeItem, phases } = useSelector((state) => state.process);
  const currentPhase = selectedPhaseTabId ? phases.find(el => el.id === selectedPhaseTabId) : phases[0]

  const setNewPhaseTab = useCallback((phase) => {
    if (mounted.current) {
      dispatch(setselectedPhaseTabId(phase.id))
    }
  }, [mounted]);

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Grid container>
        <Grid item xl={12} lg={12} md={12} xs={12}>
          <PhaseTabs selectedPhaseTabId={selectedPhaseTabId} phases={phases} onSelect={setNewPhaseTab} />
        </Grid>
        <Grid item xl={4} lg={4} md={6} xs={12}>
          <StyledTree phase={currentPhase} selectedTreeItem={selectedTreeItem} setSelectedTreeItem={setSelectedTreeItem} objectives_key="objectives" tasks_key="tasks" showIcon />
        </Grid>
        <RightSide />
      </Grid>

    </Box>
  );
};

export default Repository;
