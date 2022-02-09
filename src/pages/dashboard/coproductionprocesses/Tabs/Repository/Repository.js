import {
  Avatar, Box, Button, Collapse, Grid, List,
  ListItem,
  ListItemAvatar, alpha,
  ListItemText, Paper, Typography, InputBase
} from '@material-ui/core';
import { Info as InfoIcon, Search as SearchIcon } from '@material-ui/icons';
import { styled } from '@material-ui/styles';
import MobileDiscriminator from 'components/MobileDiscriminator';
import MobileDrawer from 'components/MobileDrawer';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { cleanUnderScores } from 'utils/cleanUnderscores';
import { interlinkersApi, tasksApi } from '__fakeApi__';
import PhaseTabs from "../PhaseTabs";
import Assets from './Assets';
import NewAssetModal from './NewAssetModal';
import RepositoryTree from "./RepositoryTree";


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Repository = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null)
  const [assets, setAssets] = useState(null)
  const [recommendedInterlinkers, setRecommendedInterlinkers] = useState([])
  const [loadingAssets, setLoadingAssets] = useState(false)
  const [collapseOpen, setCollapseOpen] = useState(false)

  const updateAssets = async () => {
    const assets = await tasksApi.getAssets(selectedTask.id);
    setAssets(assets)
    console.log(selectedTask)
    const interlinkers = await interlinkersApi.get_by_problem_profiles(selectedTask.problem_profiles);
    setRecommendedInterlinkers(interlinkers)
    setLoadingAssets(false)
  }

  useEffect(() => {
    if (selectedTask) {
      setLoadingAssets(true)
      updateAssets()
    }
  }, [selectedTask])

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', minHeight: '85vh' }}>

      <Grid container>
        <Grid item xl={12} lg={12} md={12} xs={12}>
          <PhaseTabs />
        </Grid>
        <Grid item xl={4} lg={4} md={6} xs={12}>
          <RepositoryTree setSelectedTask={setSelectedTask} loading={loadingAssets} />
        </Grid>

        {selectedTask && <MobileDiscriminator defaultNode={
          <Grid item xl={8} lg={8} md={6} xs={12}>
            <Box sx={{ p: 2 }}>
              <Button sx={{ mb: 2 }} fullWidth variant="link" onClick={() => setCollapseOpen(!collapseOpen)}><Typography variant="h6" >{selectedTask.name} <InfoIcon /></Typography></Button>
              <Collapse in={collapseOpen} timeout="auto" unmountOnExit>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed mi odio, finibus eget porttitor eu, condimentum nec nibh. Fusce a tellus faucibus, sagittis quam eu, ornare odio. Etiam ac dolor sed elit accumsan vestibulum vel ut sapien. Duis iaculis quam in cursus euismod. Curabitur lacinia eros sit amet arcu luctus gravida. Fusce lacinia quis urna sit amet auctor. Phasellus vitae enim luctus, tempus lectus sed, feugiat elit. Nam quis nibh hendrerit, auctor eros sed, fermentum tortor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.

                Nam vehicula nunc in odio consequat, eget volutpat lectus tincidunt. In auctor pretium hendrerit. Morbi congue dolor in arcu lobortis sagittis. Donec elementum lorem ac ligula faucibus volutpat. Cras sit amet nulla tortor. Morbi posuere posuere massa pellentesque rhoncus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Quisque sed dapibus mi. Nam et ornare mauris. Nulla venenatis, augue id consequat accumsan, dolor turpis finibus eros, ac feugiat diam est sed nulla. Morbi nec eros ac erat condimentum tempus. Praesent ipsum magna, sodales id tempor vitae, viverra sed dui. Quisque eu enim a nisl tempor fermentum a vitae ipsum. Donec nisi velit, sodales varius viverra sed, finibus et libero.
                {!loadingAssets && <List dense>
                  {recommendedInterlinkers.map(interlinker => (
                    <ListItem button >
                      <ListItemAvatar>
                        <Avatar aria-label="icon" src={interlinker.logotype} sx={{ width: 30, height: 30 }} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={interlinker.name}
                        secondary={<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom> {moment(interlinker.created_at).fromNow()} </Typography>}
                      />
                    </ListItem>
                  ))}
                </List>}
              </Collapse>

              <Box sx={{ mt: 3 }}>

                <Paper>
                  <Search>
                    <SearchIconWrapper>
                      <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                      placeholder="Search…"
                      inputProps={{ 'aria-label': 'search' }}
                    />
                  </Search>
                </Paper>
                {!loadingAssets && <Assets assets={assets} />}

              </Box>
              <NewAssetModal task={selectedTask} onCreate={updateAssets} />
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
