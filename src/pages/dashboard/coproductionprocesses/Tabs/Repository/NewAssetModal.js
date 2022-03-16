import {
    Avatar, Box,
    Button, CircularProgress as MuiCircularProgress, Dialog, DialogActions, DialogContent,
    DialogTitle, Grid, IconButton, Typography
} from '@material-ui/core';
import { ArrowBack, Close, DoubleArrow, Download, Preview } from '@material-ui/icons';
import { env } from 'configuration';
import InterlinkerHeader from 'pages/dashboard/interlinkers/InterlinkerHeader';
import { useEffect, useState } from 'react';
import { assetsApi, knowledgeInterlinkersApi } from '__fakeApi__';
import InterlinkerDetails from "../../../interlinkers/InterlinkerDetails";
import { LoadingButton } from '@material-ui/lab';

const CircularProgress = ({ text = "Waiting for response...", onCancel = null }) => (
    <Box
        style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)'
        }}
    >
        <Grid container justifyContent="center" style={{ textAlign: "center" }}>
            <Grid item xs={12}>
                <Typography variant="h5">
                    {text}
                </Typography>
            </Grid>
            <Grid item xs={12} sx={{ mt: 3 }}>
                <MuiCircularProgress />
            </Grid>
            {onCancel && <Grid item xs={12} sx={{ mt: 3 }}>
                <Button color="error" onClick={onCancel}>
                    Cancel
                </Button>
            </Grid>}

        </Grid>
    </Box>
)
export default function NewAssetModal({ open, setOpen, activeStep, setStep, selectedInterlinker, task, onCreate }) {
    const [loadingInstantiator, setLoadingInstantiator] = useState(true);
    const [assetData, setAssetData] = useState(null);
    const [loadingKnowledgeInstantiation, setLoadingKnowledgeInstantiation] = useState(false);

    // if software interlinker, helper bools
    const isSoftware = selectedInterlinker.nature === "softwareinterlinker"
    const is_internally_integrated_softwareinterlinker = isSoftware && selectedInterlinker.integration && selectedInterlinker.integration.type === "internalintegration"
    const can_open_in_modal = isSoftware && is_internally_integrated_softwareinterlinker && selectedInterlinker.integration.open_in_modal

    // if knowledgeinterlinker is previewable
    const previewable = !isSoftware && selectedInterlinker.softwareinterlinker.integration && selectedInterlinker.softwareinterlinker.integration.preview
    const downloadable = !isSoftware && selectedInterlinker.softwareinterlinker.integration && selectedInterlinker.softwareinterlinker.integration.download

    const handleClose = () => {
        setOpen(false);
        setActiveStep(0)
    };

    const setActiveStep = async (i) => {
        if (i === 0) {
            setAssetData(null)
            setStep(0)
            setLoadingInstantiator(false)
        }
        if (i === 1) {
            if (isSoftware) {
                setStep(1)
                if (is_internally_integrated_softwareinterlinker) {
                    if (can_open_in_modal) {
                        setLoadingInstantiator(true)
                    }
                }
            }
            else {
                // if knowledgeinterlinker
                setLoadingKnowledgeInstantiation(true)
                const interlinker_asset = await knowledgeInterlinkersApi.instantiate(selectedInterlinker.id)
                const coproduction_asset = await onAssetCreate(interlinker_asset, selectedInterlinker.softwareinterlinker_id, selectedInterlinker.id)
                setLoadingKnowledgeInstantiation(false)

                // TODO: if fails
                onFinish({ ...coproduction_asset, ...interlinker_asset })
            }
        } else {
            setStep(i)
        }

    }

    const onAssetCreate = async (data, softwareinterlinker_id, knowledgeinterlinker_id) => await assetsApi.create(
        task.id,
        softwareinterlinker_id,
        knowledgeinterlinker_id,
        data.id || data._id,
    );

    const onFinish = (result) => {
        setAssetData(result)
        setActiveStep(2)
        onCreate()
    }

    async function onMessage(event) {
        // Check sender origin to be trusted
        console.log(event.origin, env)
        if (event.origin.length > 0 && event.origin.includes(env.DOMAIN)) return;
        const { code, message } = event.data
        console.log(code, message)

        if (code === "initialized") {
            setLoadingInstantiator(false)
        }
        if (code === "asset_created") {
            //task_id, interlinker_id, external_asset_id
            const coproduction_asset = await onAssetCreate(message, selectedInterlinker.id, null)
            // TODO: if fails
            const interlinker_asset = await assetsApi.getExternal(coproduction_asset.id)
            onFinish({ ...coproduction_asset, ...interlinker_asset })
        }
    }

    useEffect(() => {
        // https://stackoverflow.com/questions/2161388/calling-a-parent-window-function-from-an-iframe

        if (activeStep === 1) {

            if (isSoftware) {
                if (is_internally_integrated_softwareinterlinker) {
                    // Initiate listeners if is an internally integrated software interlinker
                    if (window.addEventListener) {  // all browsers except IE before version 9
                        window.addEventListener("message", onMessage, false);
                    }
                    else if (window.attachEvent) {
                        window.attachEvent("onmessage", onMessage, false);
                    }

                    // if cannot be opened in a modal, open a window
                    if (!can_open_in_modal) {
                        window.open(`${selectedInterlinker.backend}/instantiate`)
                    }
                } else {
                    // external software solution, so redirect to it
                    window.open(`${selectedInterlinker.integration.redirection}`)
                }
            }
        }

        return () => {
            if (window.addEventListener) {
                window.removeEventListener("message", onMessage, false);
            }
            else if (window.attachEvent) {
                window.attachEvent("onmessage", onMessage, false);
            }
        }
    }, [activeStep, selectedInterlinker]);

    const getHeight = () => {
        if (activeStep === 0) {
            return "70vh"
        }
        if (activeStep === 1) {
            return isSoftware ? "70vh" : "50vh"
        }
        return "40vh"
    }

    return (
        <Dialog
            fullWidth
            maxWidth="lg"
            open={open}
            onClose={handleClose}

        >
            <DialogTitle sx={{
                alignItems: "center",
                backgroundColor: 'background.default',
                pb: 0
            }}>

                <Grid container spacing={2}>
                    <Grid item xs={1}>
                        {activeStep > 0 && <IconButton children={<ArrowBack />} onClick={() => setActiveStep(activeStep - 1)} />}
                    </Grid>
                    <Grid item xs={10}>
                        {activeStep === 0 && <InterlinkerHeader interlinker={selectedInterlinker} />}
                    </Grid>
                    <Grid item xs={1} style={{ textAlign: "right" }}>
                        <IconButton children={<Close />} onClick={handleClose} />
                    </Grid>
                </Grid>

            </DialogTitle>

            <DialogContent style={{ minHeight: getHeight() }} sx={{
                alignItems: "center",
                backgroundColor: 'background.default'
            }}>
                {activeStep === 0 && <Box>
                    <InterlinkerDetails interlinker={selectedInterlinker} />
                </Box>}

                {activeStep === 1 && isSoftware && <Box>
                    {/* If software interlinker */}
                    {can_open_in_modal ?
                        <>
                            {loadingInstantiator && <CircularProgress text="Loading instantiator..." />}
                            <iframe style={{ display: loadingInstantiator ? "none" : "block" }} src={`${selectedInterlinker.backend}/instantiate`} style={{ width: "100%", minHeight: "60vh", border: 0 }}></iframe>
                        </> :
                        <CircularProgress onCancel={() => setActiveStep(0)} />
                    }
                </Box>}

                {activeStep === 2 && <Box
                    style={{
                        position: 'absolute', left: '50%', top: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Avatar src={assetData.icon} />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography
                            align='center'
                            color='textPrimary'
                            variant='h3'
                        >
                            Asset '{assetData.name}' created!
                        </Typography>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography
                            align='center'
                            color='textSecondary'
                            variant='subtitle1'
                        >
                            The asset is now accessible for this task.
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 2,
                        }}
                    >
                        <Button
                            color='primary'
                            variant='contained'
                            onClick={() => {
                                window.open(assetData.link + "/view", "_blank")
                                handleClose()
                            }}
                        >
                            Open asset
                        </Button>

                        <Button
                            color='primary'
                            onClick={handleClose}
                            variant='text'
                        >
                            Dispose this window
                        </Button>
                    </Box>
                </Box>}
            </DialogContent>
            {activeStep === 0 && <DialogActions sx={{ bgcolor: "background.default", justifyContent: "center" }}>
                {previewable && <Button startIcon={<Preview />} sx={{ my: 2, mx: 4 }} autoFocus variant="outlined" color="warning" onClick={() => window.open(selectedInterlinker.link + "/preview", "_blank")}>
                    {selectedInterlinker.softwareinterlinker.integration.preview_text} (it will be not related to project, for features exploration)
                </Button>}
                {downloadable && <Button startIcon={<Download />} sx={{ my: 2, mx: 4 }} autoFocus variant="outlined" color="warning" onClick={() => window.open(selectedInterlinker.link + "/download", "_blank")}>
                Download locally as resource not related to project (for features exploration)
                </Button>}
                <LoadingButton loading={loadingKnowledgeInstantiation} startIcon={<DoubleArrow />} sx={{ my: 2, mx: 4 }} autoFocus variant="contained" onClick={() => setActiveStep(1)}>
                    Instantiate as resource to use in project
                </LoadingButton>
            </DialogActions>}
        </Dialog>
    );
}