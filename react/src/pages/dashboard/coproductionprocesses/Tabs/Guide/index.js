import { Box, Grid } from '@material-ui/core';
import { PhaseTabs, StyledTree } from 'components/dashboard/tree';
import useMounted from 'hooks/useMounted';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { softwareInterlinkersApi } from '__api__';
import RightSide from './RightSide';

const Guide = ({ setSelectedTreeItem }) => {
  const dispatch = useDispatch();
  const mounted = useMounted();
  const [softwareInterlinkers, setSoftwareInterlinkers] = useState([])
  const { process, tree, selectedPhaseTab, selectedTreeItem, updatingTree } = useSelector((state) => state.process);

  useEffect(() => {
    softwareInterlinkersApi.getMulti({}, process.language).then(res => {
      if (mounted.current) {
        setSoftwareInterlinkers(res.items)
      }
    })
  }, [])

  const setNewPhaseTab = useCallback((phase) => {
    if (mounted.current) {
      dispatch(setSelectedTreeItem(phase))
    }
  }, [mounted]);

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Grid container>
        <Grid item xl={12} lg={12} md={12} xs={12}>
          <PhaseTabs loading={updatingTree} selectedId={selectedPhaseTab.id} treeitems={tree} onSelect={setNewPhaseTab} />
        </Grid>
        <Grid item xl={4} lg={4} md={6} xs={12}>
          <StyledTree language={process.language} parent={selectedPhaseTab} selectedTreeItem={selectedTreeItem} setSelectedTreeItem={setSelectedTreeItem} showIcon />
        </Grid>
        <RightSide softwareInterlinkers={softwareInterlinkers} />
      </Grid>
    </Box>
  );
};

export default Guide;
