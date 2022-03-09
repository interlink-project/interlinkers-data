import { AppBar, Box, Grid, Divider } from '@material-ui/core';
import { useState } from 'react';
import PhaseTabs from "../PhaseTabs";
import RepositoryTree from "./RepositoryTree";
import RightPart from './RightPart';

const Repository = () => {
  const [selectedTask, setSelectedTask] = useState(null)

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', minHeight: '87vh' }}>

      <Grid container>
        <Grid item xl={12} lg={12} md={12} xs={12}>
          <PhaseTabs />
        </Grid>
        <Grid item xl={4} lg={4} md={6} xs={12}>
          <RepositoryTree setSelectedTask={setSelectedTask} loading={false} />
        </Grid>
        <RightPart selectedTask={selectedTask} />
      </Grid>

    </Box>
  );
};

export default Repository;
