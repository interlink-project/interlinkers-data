import { Alert, alpha, Avatar, Box, Rating, Button, Card, CardActionArea, CardActions, CardHeader, CircularProgress, Collapse, Divider, Grid, InputBase, Menu, MenuItem, Paper, Stack, Typography } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { Check, KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import { styled } from '@material-ui/styles';
import { AssetsTable } from 'components/dashboard/assets';
import { NatureChip, OfficialityChip } from 'components/dashboard/assets/Icons';
import { TreeItemData } from 'components/dashboard/tree';
import { truncate } from 'lodash';
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

    const logotype = interlinker.logotype_link || (interlinker.softwareinterlinker && interlinker.softwareinterlinker.logotype_link)
    return <>
        <CardActionArea style={sameHeightCards} onClick={onClick}>
            <Card onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)} sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <CardHeader
                    sx={{ px: 2, pt: 2, pb: 0 }}
                    avatar={logotype && <Avatar sx={{ width: 25, height: 25 }} variant="rounded" src={logotype} />}
                    title={<Stack direction="column" justifyContent="center" spacing={1}>

                        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>{interlinker.name}</Typography>
                        <Box sx={{
                            position: "absolute",
                            top: 10,
                            right: 10
                        }}>
                            {assets.find(el => el.knowledgeinterlinker_id === interlinker.id || el.softwareinterlinker_id === interlinker.id) && <Check style={{ color: green[500] }} />}
                        </Box>
                    </Stack>} 
                    />

                <Typography sx={{ p: 2 }} variant="body2" color="text.secondary">
                    {HTMLtoText(truncate(interlinker.description, {
                        length: 150,
                        separator: ' ',
                    }))}
                </Typography>
                <CardActions sx={{ textAlign: "center"}}>
                    <Stack direction="column" justifyContent="center" spacing={1} sx={{textAlign: "center"}}>
                    <NatureChip nature={interlinker.nature} />
                    <Rating readOnly value={interlinker.rating} size="small" />
                    </Stack>
                    
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
    const { selectedTreeItem } = useSelector((state) => state.process);

    const [step, setStep] = useState(0);

    const [assets, setAssets] = useState([])
    const [recommendedInterlinkers, setRecommendedInterlinkers] = useState([])
    const [loadingTaskInfo, setLoadingTaskInfo] = useState(false)
    const [recommendedInterlinkersOpen, setrecommendedInterlinkersOpen] = useState(false)
    const [treeItemInfoOpen, setTreeItemInfoOpen] = useState(true)
    const [softwareInterlinkers, setSoftwareInterlinkers] = useState([])

    // new asset modal
    const [selectedInterlinker, setSelectedInterlinker] = useState(null)
    const [newAssetDialogOpen, setNewAssetDialogOpen] = useState(false)

    const updateTaskInfo = async () => {
        const assets = await assetsApi.getMulti({ task_id: selectedTreeItem.id });
        setAssets(assets.items)
        const interlinkers = await interlinkersApi.getByProblemProfiles(null, null, selectedTreeItem.problem_profiles);
        setRecommendedInterlinkers(interlinkers.items)
        setLoadingTaskInfo(false)
    }

    useEffect(() => {
        if (selectedTreeItem && selectedTreeItem.type === "task") {
            setLoadingTaskInfo(true)
            updateTaskInfo()
        }
    }, [selectedTreeItem])

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

    const isTask = selectedTreeItem && selectedTreeItem.type === "task"
    return (

        selectedTreeItem && <Grid item xl={8} lg={8} md={6} xs={12}>
                <Box sx={{ p: 2 }}>
                    <Button sx={{ mb: 2 }} fullWidth variant="outlined" onClick={() => setTreeItemInfoOpen(!treeItemInfoOpen)}>
                        <Stack spacing={2}>
                            <Typography variant="h6" >Information about the {selectedTreeItem.type}</Typography>
                            <Divider> {!treeItemInfoOpen ? <KeyboardArrowDown /> : <KeyboardArrowUp />}</Divider>
                        </Stack>
                    </Button>
                    <Collapse in={treeItemInfoOpen} timeout="auto" unmountOnExit>
                        <TreeItemData type={selectedTreeItem.type} element={selectedTreeItem} showType={false} />
                    </Collapse>
                    {isTask && <>

                        <Button sx={{ my: 2 }} fullWidth variant="outlined" onClick={() => setrecommendedInterlinkersOpen(!recommendedInterlinkersOpen)}>
                            <Stack spacing={2}>
                                <Typography variant="h6" >Recommended interlinkers</Typography>
                                <Divider> {!recommendedInterlinkersOpen ? <KeyboardArrowDown /> : <KeyboardArrowUp />}</Divider>
                            </Stack>
                        </Button>
                        <Collapse in={recommendedInterlinkersOpen} timeout="auto" unmountOnExit>

                            {loadingTaskInfo ?
                                <CircularProgress /> : recommendedInterlinkers.length === 0 ? <Alert severity="warning">No recommended interlinkers found</Alert> : <Grid container spacing={3} justifyContent="flex-start">

                                    {recommendedInterlinkers.map(interlinker => (
                                        <Grid item xs={12} md={6} lg={4} xl={4} key={interlinker.id}>
                                            <RecommendedInterlinkerCard assets={assets} onClick={() => {
                                                setStep(0);
                                                setSelectedInterlinker(interlinker);
                                                setNewAssetDialogOpen(true)
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
                                <Typography sx={{ mb: 1 }} variant="h6">Current resources:</Typography>

                                <AssetsTable assets={assets} onChange={updateTaskInfo} />

                            </Box>
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
                                        setStep(1);
                                        setSelectedInterlinker(si);
                                        setNewAssetDialogOpen(true)
                                        handleClose()
                                    }
                                    }>
                                        <Avatar src={si.logotype_link} sx={{ mr: 2, height: "20px", width: "20px" }} />{si.integration.instantiate_text}
                                    </MenuItem>)}
                            </Menu>
                        </Box>
                        {selectedInterlinker && <NewAssetModal open={newAssetDialogOpen} setOpen={setNewAssetDialogOpen} activeStep={step} setStep={setStep} selectedInterlinker={selectedInterlinker} task={selectedTreeItem} onCreate={updateTaskInfo} />}
                    </>}
                </Box>
        </Grid>
    );
};

export default RightPart;
