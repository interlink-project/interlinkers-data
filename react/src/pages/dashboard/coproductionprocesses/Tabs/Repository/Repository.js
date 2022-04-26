import { Box, Grid } from '@material-ui/core';
import PhaseTabs from "../PhaseTabs";
import RepositoryTree from "./RepositoryTree";
import RightPart from './RightPart';

const Repository = ({ setSelectedTreeItem }) => {

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>

      <Grid container>
        <Grid item xl={12} lg={12} md={12} xs={12}>
          <PhaseTabs />
        </Grid>
        <Grid item xl={4} lg={4} md={6} xs={12}>
          <RepositoryTree setSelectedTreeItem={setSelectedTreeItem} loading={false} />
        </Grid>
        <RightPart />
      </Grid>

    </Box>
  );
};

export default Repository;
