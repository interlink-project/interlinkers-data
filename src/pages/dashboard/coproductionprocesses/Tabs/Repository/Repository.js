import { AppBar, Box, Grid, Divider } from '@material-ui/core';
import { useState } from 'react';
import PhaseTabs from "../PhaseTabs";
import RepositoryTree from "./RepositoryTree";
import RightPart from './RightPart';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedTask } from 'slices/process';

const Repository = () => {
  const { selectedTask } = useSelector((state) => state.process);
  const dispatch = useDispatch()

  const _setSelectedTask = (task) => {
    dispatch(setSelectedTask(task))
  }
  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', minHeight: '87vh' }}>

      <Grid container>
        <Grid item xl={12} lg={12} md={12} xs={12}>
          <PhaseTabs />
        </Grid>
        <Grid item xl={4} lg={4} md={6} xs={12}>
          <RepositoryTree setSelectedTask={_setSelectedTask} loading={false} />
        </Grid>
        <RightPart />
      </Grid>

    </Box>
  );
};

export default Repository;
