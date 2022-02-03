import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography
} from '@material-ui/core';
import Assets from './Assets';
import Tabs from "../Tabs";
import RepositoryTree from "./RepositoryTree";
import MobileDiscriminator from 'components/MobileDiscriminator';
import MobileDrawer from 'components/MobileDrawer';
import { taskinstantiationsApi } from '__fakeApi__';
import NewAssetModal from './NewAssetModal';
import { cleanUnderScores } from 'utils/cleanUnderscores';

const Repository = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null)
  const [assets, setAssets] = useState(null)
  const [loadingAssets, setLoadingAssets] = useState(false)

  const updateAssets = async () => {
    setLoadingAssets(true)
    const assets = await taskinstantiationsApi.getAssets(selectedTask.id);
    setAssets(assets)
    setLoadingAssets(false)
  }

  useEffect(() => {
    if (selectedTask) {
      updateAssets()
    }
  }, [selectedTask])

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', minHeight: '85vh' }}>

      <Grid container>
        <Grid item xl={12} lg={12} md={12} xs={12}>
          <Tabs />
        </Grid>
        <Grid item xl={4} lg={4} md={6} xs={12}>
          <RepositoryTree setSelectedTask={setSelectedTask} loading={loadingAssets} />
        </Grid>

        {selectedTask && <MobileDiscriminator defaultNode={
          <Grid item xl={8} lg={8} md={6} xs={12}>
            <Box sx={{ p: 2 }}>
              <Box sx={{ justifyContent: "center" }} >
                <Typography variant="h6" sx={{ mb: 2 }}>Assets for {cleanUnderScores(selectedTask.name)} </Typography>
              </Box>
              <Box sx={{ mt: 3 }}>
                <Assets assets={assets} />

              </Box>
              <NewAssetModal taskinstantiation={selectedTask} onCreate={updateAssets} />
            </Box>
          </Grid>
        } onMobileNode={
          <MobileDrawer open={mobileDrawerOpen} onClose={() => { setMobileDrawerOpen(false) }} content={<Assets assets={assets} />} />
        } />}

      </Grid>

    </Box>
  );
};

export default Repository;
