import { Alert, Avatar, Box, Button, Dialog, DialogContent, Grid, IconButton, Menu, MenuItem, Paper, Stack, Tab, Tabs, TextField } from '@material-ui/core';
import { Close, CopyAll, Delete, Download, Edit, KeyboardArrowDown, OpenInNew } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import { AssetsTable } from 'components/dashboard/assets';
import InterlinkerBrowse from 'components/dashboard/interlinkers/browse/InterlinkerBrowse';
import { TreeItemData } from 'components/dashboard/tree';
import PermissionsTable from 'components/dashboard/tree/PermissionsTable';
import { Formik } from 'formik';
import useDependantTranslation from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTree } from 'slices/process';
import { information_about_translations } from 'utils/someCommonTranslations';
import * as Yup from 'yup';
import { assetsApi, permissionsApi } from '__api__';
import NewAssetModal from './NewAssetModal';

const RightSide = ({ softwareInterlinkers }) => {
    const { process, isAdministrator, selectedTreeItem } = useSelector((state) => state.process);
    const isTask = selectedTreeItem && selectedTreeItem.type === "task"
    const [step, setStep] = useState(0);

    const [assets, setAssets] = useState([])
    const [loadingAssets, setLoadingAssets] = useState(false)
    const [loading, setLoading] = useState("")
    // new asset modal
    const [selectedInterlinker, setSelectedInterlinker] = useState(null)
    const [newAssetDialogOpen, setNewAssetDialogOpen] = useState(false)
    const mounted = useMounted()
    const [externalAssetOpen, setExternalAssetOpen] = useState(false);
    const [catalogueOpen, setCatalogueOpen] = useState(false);
    const { t } = useDependantTranslation()
    const dispatch = useDispatch();

    const [permissions, setPermissions] = useState(null)

    useEffect(() => {
        setPermissions(null)
        permissionsApi.for(selectedTreeItem.id).then(res => {
            setPermissions(res)
            if (isTask && mounted.current && res && res.your_permissions && res.your_permissions.access_assets_permission) {
                getAssets()
            }

        })
    }, [selectedTreeItem])

    const getAssets = async () => {
        setLoadingAssets(true)
        assetsApi.getMulti({ task_id: selectedTreeItem.id }).then(assets => {
            if (mounted.current) {
                setAssets(assets)
                setLoadingAssets(false)
            }
        });
    }

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const information_translations = information_about_translations(t)

    const [tabValue, setTabValue] = useState('data');
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        if (!isTask && tabValue === "assets") {
            setTabValue('data')
        }
    }, [selectedTreeItem, tabValue])

    const can = {
        delete: isAdministrator || (permissions && permissions.your_permissions.delete_assets_permission),
        create: isAdministrator || (permissions && permissions.your_permissions.create_assets_permission),
        view: isAdministrator || (permissions && permissions.your_permissions.access_assets_permission),
    }


    const handleOpen = (asset) => {
        if (asset.type === "internalasset") {
            window.open(asset.link + "/view", "_blank")
        } else {
            window.open(asset.uri)
        }
    }

    const handleDelete = (asset, callback) => {
        setLoading("delete");
        assetsApi.delete(asset.id).then(() => {
            setLoading("");
            callback && callback();
            setAnchorEl(null);
        });
    }

    const handleClone = (asset, callback) => {
        setLoading("clone");
        assetsApi.clone(asset.id).then(() => {
            setLoading("");
            callback && callback();
            setAnchorEl(null);
        })
    }

    const handleDownload = (asset) => {
        window.open(asset.link + "/download", "_blank");
        setAnchorEl(null);
    }

    const handleEdit = (asset) => {
        window.open(asset.link + "/edit", "_blank");
        setAnchorEl(null);
    }

    const getAssetsActions = (asset) => {
        const actions = []
        console.log(asset)
        if (asset.type === "internalasset" && asset.capabilities) {
            const { id, capabilities } = asset

            actions.push({
                id: `${id}-open-action`,
                loading: loading === "open",
                onClick: (closeMenuItem) => {
                    handleOpen(asset)
                    closeMenuItem()
                },
                text: t("Open"),
                icon: <OpenInNew fontSize="small" />
            })

            if (capabilities.edit) {
                actions.push({
                    id: `${id}-edit-action`,
                    loading: loading === "edit",
                    onClick: (closeMenuItem) => {
                        handleEdit(asset)
                        closeMenuItem()
                        getAssets()
                    },
                    text: t("Edit"),
                    icon: <Edit fontSize="small" />
                })
            }
            if (capabilities.clone) {
                actions.push({
                    id: `${id}-clone-action`,
                    loading: loading === "clone",
                    onClick: (closeMenuItem) => {
                        handleClone(asset, () => {
                            closeMenuItem()
                            getAssets()
                        })
                        getAssets()
                    },
                    text: t("Clone"),
                    icon: <CopyAll fontSize="small" />
                })
            }
            if (capabilities.delete) {
                actions.push({
                    id: `${id}-delete-action`,
                    loading: loading === "delete",
                    onClick: (closeMenuItem) => {
                        handleDelete(asset, () => {
                            closeMenuItem()
                            getAssets()
                        })
                        getAssets()
                    },
                    disabled: !can.delete,
                    text: t("Delete"),
                    icon: <Delete fontSize="small" />
                })
                /*
              actions.push(<ConfirmationButton
                key={`${id}-delete-action`}
                Actionator={({ onClick }) => <MyMenuItem loading={loading} id="delete" onClick={onClick} text={t("Delete")} icon={<Delete fontSize="small" />} />}
                ButtonComponent={({ onClick }) => <LoadingButton sx={{ mt: 1 }} fullWidth variant='contained' color="error" onClick={onClick}>{t("Confirm deletion")}</LoadingButton>}
                onClick={handleDelete}
                text={t("Are you sure?")} />)
                */
            }
            if (capabilities.download) {
                actions.push({
                    id: `${id}-download-action`,
                    loading: loading === "download",
                    onClick: (closeMenuItem) => {
                        handleDownload(asset)
                        closeMenuItem()
                    },
                    text: t("Download"),
                    icon: <Download fontSize="small" />
                })
            }
        }
        if (asset.type === "externalasset") {
            const { id } = asset
            actions.push({
                id: `${id}-clone-action`,
                loading: loading === "clone",
                onClick: (closeMenuItem) => {
                    handleClone(asset, () => {
                        closeMenuItem()
                        getAssets()
                    })

                },
                text: t("Clone"),
                icon: <CopyAll fontSize="small" />
            })

            actions.push({
                id: `${id}-delete-action`,
                loading: loading === "delete",
                onClick: (closeMenuItem) => {
                    handleDelete(asset, () => {
                        closeMenuItem()
                        getAssets()
                    })
                },
                text: t("Delete"),
                icon: <Delete fontSize="small" />
            })
        }

        return actions
    }

    return (

        selectedTreeItem && <Grid item xl={8} lg={8} md={6} xs={12}>
            <Box sx={{ p: 2 }}>
                <Paper sx={{ bgcolor: "background.default" }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        aria-label="guide-right-side-tabs"
                        sx={{ mb: 2 }}
                        centered
                    >
                        <Tab wrapped value="data" label={information_translations[selectedTreeItem.type]} />
                        <Tab value="assets" disabled={!isTask} label={t("Resources") + (isTask ? " (" + assets.length + ")" : "")} />
                        <Tab value="permissions" label={t("Permissions") + " (" + selectedTreeItem.permissions.length + ")"} />
                    </Tabs>
                </Paper>


                {tabValue === "data" && <TreeItemData language={process.language} processId={process.id} element={selectedTreeItem} />}
                {tabValue === "permissions" && <PermissionsTable your_permissions={permissions && permissions.your_permissions} your_roles={permissions && permissions.your_roles} onChanges={() => dispatch(getTree(process.id, selectedTreeItem.id))} language={process.language} processId={process.id} element={selectedTreeItem} isAdministrator={isAdministrator} />}
                {tabValue === "assets" && <>
                    <Box>
                        <Box sx={{ mt: 2 }}>
                            {can.view ? <AssetsTable language={process.language} loading={loadingAssets} assets={assets} getActions={getAssetsActions} /> : <Alert severity="error">{t("You do not have access to the resources of this task")}</Alert>}
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
                                        disabled={!can.create}
                                    >
                                        <>{t("Open catalogue")}</>
                                    </Button>
                                    <Button
                                        id="basic-button"
                                        aria-controls={open ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={handleClick}
                                        variant="contained"
                                        endIcon={<KeyboardArrowDown />}
                                        disabled={!can.create}
                                    >
                                        <>{t("Initiate procedure")}</>
                                    </Button>
                                </Stack>
                            </Box>
                        </Box>


                        <Dialog open={catalogueOpen} onClose={() => setCatalogueOpen(false)} maxWidth="lg" fullWidth>
                            <IconButton
                                aria-label="close"
                                onClick={() => setCatalogueOpen(false)}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                    color: (theme) => theme.palette.grey[500],
                                }}
                            >
                                <Close />
                            </IconButton>
                            <Box sx={{ minWidth: "70vh", p: 7, backgroundColor: 'background.default', }}>
                                <InterlinkerBrowse language={process.language} initialFilters={{ problemprofiles: selectedTreeItem.problemprofiles }} onInterlinkerClick={(interlinker) => {
                                    setCatalogueOpen(false)
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
                                            getAssets()
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
                            }}>
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
                    {selectedInterlinker && <NewAssetModal
                        handleUserClose={() => {
                            setNewAssetDialogOpen(false)
                            setTimeout(() => {
                                setStep(0)
                            }, 1000)
                            setCatalogueOpen(true)
                        }}
                        handleFinish={() => {
                            setNewAssetDialogOpen(false)
                            setTimeout(() => {
                                setStep(0)
                            }, 1000)
                        }}
                        open={newAssetDialogOpen}
                        activeStep={step}
                        setStep={setStep}
                        selectedInterlinker={selectedInterlinker}
                        treeitem={selectedTreeItem}
                        onCreate={() => dispatch(getTree(process.id, selectedTreeItem.id))} />}
                </>}
            </Box>
        </Grid>
    );
};

export default RightSide;
