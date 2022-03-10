import { Alert, alpha, Avatar, Box, Button, Card, CardActionArea, CardActions, CardHeader, CircularProgress, Collapse, Divider, Grid, InputBase, Menu, MenuItem, Stack, Typography } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { Check, KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import { styled } from '@material-ui/styles';
import { AssetsTable } from 'components/dashboard/assets';
import { TreeItemData } from 'components/dashboard/tree';
import MobileDiscriminator from 'components/MobileDiscriminator';
import MobileDrawer from 'components/MobileDrawer';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HTMLtoText } from 'utils/safeHTML';
import { assetsApi, interlinkersApi, softwareInterlinkersApi } from '__fakeApi__';
import NewAssetModal from './NewAssetModal';

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

const RecommendedInterlinkerCard = ({ interlinker, assets, onClick }) => {
    const [isShown, setIsShown] = useState(false);

    return <>
        <CardActionArea style={sameHeightCards} onClick={onClick}>
            <Card onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)} sx={{ height: "100%" }}>


                <CardHeader
                    avatar={assets.find(el => el.knowledgeinterlinker_id === interlinker.id || el.softwareinterlinker_id === interlinker.id) && <Avatar src={interlinker.logotype_link} />}
                    sx={{ px: 2, pt: 2, pb: 0 }}
                    title={interlinker.name}
                    subheader={interlinker.nature} />

                <Typography sx={{ p: 2 }} variant="body2" color="text.secondary">
                    {HTMLtoText(interlinker.description)}
                </Typography>


                <CardActions sx={{
                    position: "absolute",
                    bottom: 0
                }}>
                    {assets.find(el => el.knowledgeinterlinker_id === interlinker.id || el.softwareinterlinker_id === interlinker.id) && <Check style={{ color: green[500] }} />}
                </CardActions>
            </Card>
        </CardActionArea>
        {isShown && interlinker.snapshots_links && interlinker.snapshots_links[0] && (
            <Card style={{
                position: "fixed",
                bottom: 30,
                left: 30,
                zIndex: 99999,
                width: "40%",
                height: "auto"
            }} 
            onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)} sx={{ height: "100%" }}
            >
                <img style={{
                width: "100%",
                height: "auto"
                }} src={interlinker.snapshots_links[0]} />
            </Card>

        )}
    </>
}
const RightPart = () => {
    const { selectedTask } = useSelector((state) => state.process);

    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

    const [assets, setAssets] = useState([])
    const [recommendedInterlinkers, setRecommendedInterlinkers] = useState([])
    const [loadingTaskInfo, setLoadingTaskInfo] = useState(false)
    const [recommendedInterlinkersOpen, setrecommendedInterlinkersOpen] = useState(false)
    const [taskInfoOpen, setTaskInfoOpen] = useState(true)
    const [softwareInterlinkers, setSoftwareInterlinkers] = useState([])

    // new asset modal
    const [selectedInterlinker, setSelectedInterlinker] = useState(null)
    const [openNewAsset, setOpenNewAsset] = useState(false);

    const updateAssets = async () => {
        const assets = await assetsApi.getMulti({ task_id: selectedTask.id });
        setAssets(assets.items)
        console.log(selectedTask)
        const interlinkers = await interlinkersApi.getByProblemProfiles(null, null, selectedTask.problem_profiles);
        setRecommendedInterlinkers(interlinkers.items)
        setLoadingTaskInfo(false)
    }

    useEffect(() => {
        console.log("CHANGED", selectedTask)
        if (selectedTask) {
            setLoadingTaskInfo(true)
            updateAssets()
        }
    }, [selectedTask])

    useEffect(() => {
        softwareInterlinkersApi.getIntegrated().then(res => {
            setSoftwareInterlinkers(res)
        })
    }, [])

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
                    <Button sx={{ mb: 2 }} fullWidth variant="outlined" onClick={() => setTaskInfoOpen(!taskInfoOpen)}>
                        <Stack spacing={2}>
                            <Typography variant="h6" >Information about the task</Typography>
                            <Divider> {!taskInfoOpen ? <KeyboardArrowDown /> : <KeyboardArrowUp />}</Divider>
                        </Stack>
                    </Button>
                    <Collapse in={taskInfoOpen} timeout="auto" unmountOnExit>
                        <TreeItemData type="task" element={selectedTask} showType={false} />
                    </Collapse>
                    <Button sx={{ mb: 2 }} fullWidth variant="outlined" onClick={() => setrecommendedInterlinkersOpen(!recommendedInterlinkersOpen)}>
                        <Stack spacing={2}>
                            <Typography variant="h6" >Recommended interlinkers</Typography>
                            <Divider> {!recommendedInterlinkersOpen ? <KeyboardArrowDown /> : <KeyboardArrowUp />}</Divider>
                        </Stack>
                    </Button>
                    <Collapse in={recommendedInterlinkersOpen} timeout="auto" unmountOnExit>

                        {loadingTaskInfo ?
                            <CircularProgress /> : recommendedInterlinkers.length === 0 ? <Alert severity="warning">No recommended interlinkers found</Alert> : <Grid container spacing={3} justifyContent="flex-start">

                                {recommendedInterlinkers.map(interlinker => (
                                    <Grid item xs={12} md={6} lg={4} xl={3} key={interlinker.id}>
                                        <RecommendedInterlinkerCard assets={assets} onClick={() => {
                                            setSelectedInterlinker(interlinker);
                                            setOpenNewAsset(true)
                                        }} interlinker={interlinker} />
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

                            <AssetsTable assets={assets} onChange={updateAssets} />

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
                                Initiate procedure
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
                                    <Avatar src={si.logotype_link} sx={{ mr: 2, height: "20px", width: "20px" }} />{si.integration.instantiate_text}
                                </MenuItem>)}
                        </Menu>
                    </Box>

                </Box>
            </Grid>
        } onMobileNode={
            <MobileDrawer open={mobileDrawerOpen} onClose={() => { setMobileDrawerOpen(false) }} content={<AssetsTable assets={assets} onChange={updateAssets} />} />
        } />
    );
};

export default RightPart;
