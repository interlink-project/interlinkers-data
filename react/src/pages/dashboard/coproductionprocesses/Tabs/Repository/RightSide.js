import { alpha, Avatar, Box, Button, Collapse, Dialog, DialogContent, Divider, Grid, InputBase, Menu, MenuItem, Stack, TextField, Typography } from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import { styled } from '@material-ui/styles';
import { AssetsTable } from 'components/dashboard/assets';
import InterlinkerBrowse from 'components/dashboard/interlinkers/browse/InterlinkerBrowse';
import { TreeItemData } from 'components/dashboard/tree';
import { Formik } from 'formik';
import useDependantTranslation from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { assetsApi } from '__api__';
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

const RightSide = ({ softwareInterlinkers }) => {
    const { process, selectedTreeItem } = useSelector((state) => state.process);
    const isTask = selectedTreeItem && selectedTreeItem.type === "task"
    const [step, setStep] = useState(0);

    const [assets, setAssets] = useState([])
    const [loadingTaskInfo, setLoadingTaskInfo] = useState(false)
    const [treeItemInfoOpen, setTreeItemInfoOpen] = useState(true)

    // new asset modal
    const [selectedInterlinker, setSelectedInterlinker] = useState(null)
    const [newAssetDialogOpen, setNewAssetDialogOpen] = useState(false)
    const mounted = useMounted()
    const [externalAssetOpen, setExternalAssetOpen] = useState(false);
    const [catalogueOpen, setCatalogueOpen] = useState(false);
    const t = useDependantTranslation()

    const updateTaskInfo = async () => {
        assetsApi.getMulti({ task_id: selectedTreeItem.id }).then(assets => {
            if (mounted.current) {
                setAssets(assets)
                setLoadingTaskInfo(false)
            }
        });
    }

    useEffect(() => {
        if (isTask && mounted.current) {
            setLoadingTaskInfo(true)
            updateTaskInfo()
        }
    }, [mounted, selectedTreeItem])

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };


    const information_about_translations = {
        "phase": t("Information about the phase"),
        "objective": t("Information about the objective"),
        "task": t("Information about the task"),
    }

    return (

        selectedTreeItem && <Grid item xl={8} lg={8} md={6} xs={12}>
            <Box sx={{ p: 2 }}>
                <Button sx={{ mb: 2 }} fullWidth variant="outlined" onClick={() => setTreeItemInfoOpen(!treeItemInfoOpen)}>
                    <Stack spacing={2}>
                        <Typography variant="h6" >{information_about_translations[selectedTreeItem.type]}</Typography>
                        <Divider> {!treeItemInfoOpen ? <KeyboardArrowDown /> : <KeyboardArrowUp />}</Divider>
                    </Stack>
                </Button>
                <Collapse in={treeItemInfoOpen} timeout="auto" unmountOnExit>
                    <TreeItemData language={process.language} processId={process.id} type={selectedTreeItem.type} element={selectedTreeItem} />
                </Collapse>
                {isTask && <>

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
                            <Typography sx={{ mb: 1 }} variant="h6">{t("Current resources")}:</Typography>

                            <AssetsTable assets={assets} onChange={updateTaskInfo} />
                            <Box sx={{ textAlign: "center", width: "100%" }}>
                                <Stack spacing={2} >
                                    <Button
                                        id="basic-button"
                                        aria-controls={open ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={() => setCatalogueOpen(true)}
                                        variant="contained"
                                        sx={{ mt: 2 }}
                                    >
                                        {t("Open catalogue")}

                                    </Button>
                                    <Button
                                        id="basic-button"
                                        aria-controls={open ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={handleClick}
                                        variant="contained"
                                        endIcon={<KeyboardArrowDown />}
                                    >
                                        {t("Initiate procedure")}

                                    </Button>

                                </Stack>
                            </Box>
                        </Box>


                        <Dialog open={catalogueOpen} onClose={() => setCatalogueOpen(false)} maxWidth="lg" fullWidth>
                            <Box sx={{ minWidth: "70vh" }}>
                                <InterlinkerBrowse language={process.language} initialFilters={{ problemprofiles: selectedTreeItem.problemprofiles }} onInterlinkerClick={(interlinker) => {
                                    setStep(0);
                                    setSelectedInterlinker(interlinker);
                                    setNewAssetDialogOpen(true)
                                }} />
                            </Box>
                        </Dialog>
                        <Dialog open={externalAssetOpen} onClose={() => setExternalAssetOpen(false)}>
                            <DialogContent sx={{ p: 2 }}>
                                <Formik
                                    initialValues={{
                                        name: "",
                                        uri: ""
                                    }}
                                    validationSchema={Yup.object().shape({
                                        name: Yup.string()
                                            .min(3, 'Must be at least 3 characters')
                                            .max(255)
                                            .required('Required'),
                                        uri: Yup.string()
                                            .min(3, 'Must be at least 3 characters')
                                            .required('Required'),
                                    })}
                                    onSubmit={(values, { setErrors, setStatus, setSubmitting }) => {
                                        setSubmitting(true);
                                        assetsApi.create_external(selectedTreeItem.id, null, values.name, values.uri).then(res => {
                                            setStatus({ success: true });
                                            setSubmitting(false);
                                            updateTaskInfo()
                                            setExternalAssetOpen(false)

                                        }).catch(err => {
                                            setStatus({ success: false });
                                            setErrors({ submit: err });
                                            setSubmitting(false);
                                        })
                                    }}
                                >
                                    {({
                                        errors,
                                        handleBlur,
                                        handleChange,
                                        handleSubmit,
                                        isSubmitting,
                                        setFieldValue,
                                        setFieldTouched,
                                        touched,
                                        values,
                                    }) => (
                                        <form onSubmit={handleSubmit}>
                                            <Box sx={{ mt: 2 }}>
                                                <TextField
                                                    required
                                                    error={Boolean(touched.name && errors.name)}
                                                    fullWidth
                                                    helperText={touched.name && errors.name}
                                                    label='Name'
                                                    name='name'
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    onClick={() => setFieldTouched('name')}
                                                    value={values.name}
                                                    variant='outlined'
                                                />
                                                <TextField
                                                    required
                                                    sx={{ mt: 2 }}
                                                    error={Boolean(touched.uri && errors.uri)}
                                                    fullWidth
                                                    helperText={touched.uri && errors.uri}
                                                    label='URI'
                                                    name='uri'
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    onClick={() => setFieldTouched('uri')}
                                                    value={values.uri}
                                                    variant='outlined'
                                                />
                                                <LoadingButton sx={{ mt: 2 }} variant="contained" fullWidth loading={isSubmitting} onClick={handleSubmit}>{t("Create")}</LoadingButton>
                                            </Box>

                                        </form>
                                    )}
                                </Formik>
                            </DialogContent>
                        </Dialog>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleMenuClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={() => {
                                setExternalAssetOpen(true)
                                handleMenuClose()
                            }
                            }>
                                <Avatar src={"https://cdn-icons-png.flaticon.com/512/282/282100.png"} sx={{ mr: 2, height: "20px", width: "20px" }} />{t("Link an external resource")}
                            </MenuItem>
                            {softwareInterlinkers.map(si =>
                                <MenuItem key={si.id} onClick={() => {
                                    setStep(1);
                                    setSelectedInterlinker(si);
                                    setNewAssetDialogOpen(true)
                                    handleMenuClose()
                                }
                                }>
                                    <Avatar variant="rounded" src={si.logotype_link} sx={{ mr: 2, height: "20px", width: "20px" }} />{si.instantiate_text}
                                </MenuItem>)}

                        </Menu>
                    </Box>
                    {selectedInterlinker && <NewAssetModal open={newAssetDialogOpen} setOpen={setNewAssetDialogOpen} activeStep={step} setStep={setStep} selectedInterlinker={selectedInterlinker} task={selectedTreeItem} onCreate={updateTaskInfo} />}
                </>}
            </Box>
        </Grid>
    );
};

export default RightSide;
