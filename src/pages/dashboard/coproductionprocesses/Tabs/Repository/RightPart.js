import {
    Avatar, Box, Button, Collapse, Grid, Menu, MenuItem,
    ToggleButton,
    ToggleButtonGroup, alpha,
    CircularProgress, Alert, Typography, InputBase,
    Divider, Stack, Card, CardContent, CardMedia, CardActionArea, CardActions, CardHeader
} from '@material-ui/core';
import { Check, Info as InfoIcon, KeyboardArrowDown, KeyboardArrowUp, Search as SearchIcon } from '@material-ui/icons';
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
import { truncate } from 'lodash';
import { FinishedIcon, InProgressIcon } from './Icons';
import { useDispatch, useSelector } from 'react-redux';
import { updateTask } from 'slices/process';
import { SafeHTMLElement } from 'utils/safeHTML';
import { green } from '@material-ui/core/colors';

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
const sameHeightCards = {
    minHeight: "200px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
}
const RightPart = ({ selectedTask }) => {
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

    const [assets, setAssets] = useState([])
    const [recommendedInterlinkers, setRecommendedInterlinkers] = useState([])
    const [loadingTaskInfo, setLoadingTaskInfo] = useState(false)
    const [collapseOpen, setCollapseOpen] = useState(false)
    const [softwareInterlinkers, setSoftwareInterlinkers] = useState([])

    // new asset modal
    const [selectedInterlinker, setSelectedInterlinker] = useState(null)
    const [openNewAsset, setOpenNewAsset] = useState(false);

    // status
    const [status, setStatus] = useState(selectedTask ? selectedTask.status : "awaiting");

    const updateAssets = async () => {
        const assets = await tasksApi.getAssets(selectedTask.id);
        setAssets(assets)
        console.log(selectedTask)
        const interlinkers = await interlinkersApi.get_by_problem_profiles(selectedTask.problem_profiles);
        setRecommendedInterlinkers(interlinkers)
        setLoadingTaskInfo(false)
    }

    useEffect(() => {
        if (selectedTask) {
            setLoadingTaskInfo(true)
            updateAssets()
        }
    }, [selectedTask])

    useEffect(() => {
        interlinkersApi.getSoftwareInterlinkers().then(res => {
            setSoftwareInterlinkers(res)
        })
    }, [])

    const dispatch = useDispatch();

    const handleChange = (event, newStatus) => {
        tasksApi.update(selectedTask.id, {
            status: newStatus
        }).then((res) => {
            setStatus(newStatus)
        })
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (

        selectedTask && <MobileDiscriminator defaultNode={
            <Grid item xl={8} lg={8} md={6} xs={12}>
                <Box sx={{ p: 2 }}>
                    <Button sx={{ mb: 2 }} fullWidth variant="outlined" onClick={() => setCollapseOpen(!collapseOpen)}>
                        <Stack spacing={2}>
                            <Typography variant="h6" >{selectedTask.name}</Typography>
                            <Divider> {!collapseOpen ? <KeyboardArrowDown /> : <KeyboardArrowUp />}</Divider>
                        </Stack>
                    </Button>
                    <Collapse in={collapseOpen} timeout="auto" unmountOnExit>

                        <Typography variant="h6">Description of the task:</Typography>
                        {selectedTask.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed mi odio, finibus eget porttitor eu, condimentum nec nibh. Fusce a tellus faucibus, sagittis quam eu, ornare odio. Etiam ac dolor sed elit accumsan vestibulum vel ut sapien. Duis iaculis quam in cursus euismod. Curabitur lacinia eros sit amet arcu luctus gravida. Fusce lacinia quis urna sit amet auctor. Phasellus vitae enim luctus, tempus lectus sed, feugiat elit. Nam quis nibh hendrerit, auctor eros sed, fermentum tortor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam vehicula nunc in odio consequat, eget volutpat lectus tincidunt."}
                        <Typography variant="h6" sx={{ mt: 2 }}>Current status of the task:</Typography>
                        <ToggleButtonGroup
                            sx={{ mt: 1 }}
                            color={status === "finished" ? "success" : status === "in_progress" ? "warning" : "primary"}
                            value={status}
                            exclusive
                            fullWidth
                            onChange={handleChange}
                        >
                            <ToggleButton value="awaiting">Awaiting</ToggleButton>
                            <ToggleButton value="in_progress">In progress <InProgressIcon /></ToggleButton>
                            <ToggleButton value="finished">Finished <FinishedIcon /></ToggleButton>
                        </ToggleButtonGroup>
                        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Recommended interlinkers for this task:</Typography>
                        {loadingTaskInfo ?
                            <CircularProgress /> : recommendedInterlinkers.length === 0 ? <Alert severity="warning">No recommended interlinkers found</Alert> : <Grid container spacing={3} justifyContent="flex-start">

                                {recommendedInterlinkers.map(interlinker => (
                                    <Grid item xs={12} md={6} lg={4} xl={3} key={interlinker.id}                       >
                                        <Card style={sameHeightCards}>
                                            <CardActionArea onClick={() => {
                                                setSelectedInterlinker(interlinker);
                                                setOpenNewAsset(true)
                                            }}>

                                                <CardHeader
                                                    avatar={assets.find(el => el.knowledgeinterlinker_id === interlinker.id || el.softwareinterlinker_id === interlinker.id) && <Check style={{ color: green[500] }} />}
                                                    sx={{ px: 2, pt: 2, pb: 0 }}
                                                    title={interlinker.name}
                                                    subheader={moment(interlinker.created_at).format("LL")} />

                                                <Typography sx={{ px: 2 }} variant="body2" color="text.secondary">
                                                    <SafeHTMLElement data={interlinker.description} />
                                                </Typography>
                                                <CardMedia
                                                    sx={{
                                                        bottom: 0,
                                                        maxHeight: "200px"
                                                    }}
                                                    component="img"
                                                    image={interlinker.snapshots[0]}
                                                />
                                            </CardActionArea>
                                        </Card>

                                    </Grid>
                                ))}
                            </Grid>}

                        <Divider sx={{ my: 2 }} />
                    </Collapse>
                    <Box>
                        <Box sx={{ mt: 2 }}>

                            {/* <Paper>
                      <Search>
                        <SearchIconWrapper>
                          <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                          placeholder="Search…"
                          inputProps={{ 'aria-label': 'search' }}
                        />
                      </Search>
                    </Paper>*/}
                            <Typography sx={{ mb: 1 }} variant="h6">Current assets:</Typography>

                            <Assets assets={assets} onChange={updateAssets} />

                        </Box>

                        {selectedInterlinker && openNewAsset && <NewAssetModal open={openNewAsset} setOpen={setOpenNewAsset} selectedInterlinker={selectedInterlinker} task={selectedTask} onCreate={updateAssets} />}

                        <Box sx={{ textAlign: "center", width: "100%" }}>
                            <Button
                                id="basic-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                                variant="contained"
                                sx={{ mt: 2 }}
                                endIcon={<KeyboardArrowDown />}
                            >
                                Add new empty asset
                            </Button>
                        </Box>

                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            {softwareInterlinkers.map(si =>
                                <MenuItem key={si.id} onClick={() => {
                                    setSelectedInterlinker(si);
                                    setOpenNewAsset(true)
                                    handleClose()
                                }
                                }>
                                    <Avatar src={si.logotype} sx={{ mr: 2, height: "20px", width: "20px" }} />{si.name}
                                </MenuItem>)}
                        </Menu>
                    </Box>

                </Box>
            </Grid>
        } onMobileNode={
            <MobileDrawer open={mobileDrawerOpen} onClose={() => { setMobileDrawerOpen(false) }} content={<Assets assets={assets} onChange={updateAssets} />} />
        } />
    );
};

export default RightPart;
