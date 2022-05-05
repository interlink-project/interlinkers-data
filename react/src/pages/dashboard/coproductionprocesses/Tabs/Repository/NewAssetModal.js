import {
    Avatar, Box,
    Button, CircularProgress as MuiCircularProgress, Dialog, DialogActions, DialogContent,
    DialogTitle, Grid, IconButton, Typography
} from '@material-ui/core';
import { ArrowBack, Close, DoubleArrow, Download, Preview } from '@material-ui/icons';
import { env } from 'configuration';
import InterlinkerHeader from 'pages/dashboard/interlinkers/InterlinkerHeader';
import { useEffect, useState } from 'react';
import { assetsApi, knowledgeInterlinkersApi } from '__api__';
import InterlinkerDetails from "../../../interlinkers/InterlinkerDetails";
import { LoadingButton } from '@material-ui/lab';
import useMounted from 'hooks/useMounted';

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
    const isKnowledge = selectedInterlinker.nature === "knowledgeinterlinker"
    const isExternal = selectedInterlinker.nature === "externalinterlinker" || selectedInterlinker.nature === "externalknowledgeinterlinker"
    const can_open_in_modal = isSoftware && selectedInterlinker.open_in_modal

    // if knowledgeinterlinker is previewable
    const previewable = isKnowledge && selectedInterlinker.softwareinterlinker.preview
    const downloadable = isKnowledge && selectedInterlinker.softwareinterlinker.download
    const instantiatable = (isSoftware && selectedInterlinker.instantiate) || (isKnowledge && selectedInterlinker.softwareinterlinker.instantiate)

    const mounted = useMounted()

    const handleClose = () => {
        setOpen(false);
        setTimeout(() => {
            setStep(0)
        }, 1000)
    };

    const onFinish = (result) => {
        setAssetData(result)
        setStep(2)
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
            const coproduction_asset = await assetsApi.create_internal(
                task.id,
                selectedInterlinker.id,
                message.id || message._id,
            );
        
            // TODO: if fails
            const interlinker_asset = await assetsApi.getInternal(coproduction_asset.id)
            onFinish({ ...coproduction_asset, ...interlinker_asset })
        }
    }

    useEffect(() => {
        // https://stackoverflow.com/questions/2161388/calling-a-parent-window-function-from-an-iframe

        const doAsync = async () => {
            if (activeStep === 0) {
                setAssetData(null)
                setStep(0)
                setLoadingInstantiator(false)
            }
            if (activeStep === 1) {
                if (isSoftware) {
                    // Initiate listeners if is an internally Internal software interlinker
                    if (window.addEventListener) {  // all browsers except IE before version 9
                        window.addEventListener("message", onMessage, false);
                    }
                    else if (window.attachEvent) {
                        window.attachEvent("onmessage", onMessage, false);
                    }
    
                    // if cannot be opened in a modal, open a window
                    if (!can_open_in_modal) {
                        window.open(`${selectedInterlinker.backend}/instantiate`)
                    }else{
                        setLoadingInstantiator(true)
                    }
                }
                else if(isKnowledge) {
                    // if knowledgeinterlinker
                    setLoadingKnowledgeInstantiation(true)
                    const interlinker_asset = await assetsApi.instantiate(selectedInterlinker.id, task.id)
                    setLoadingKnowledgeInstantiation(false)
    
                    // TODO: if fails
                    onFinish(interlinker_asset)
                }
                if (isExternal) {
                    window.open(selectedInterlinker.uri)
                }
            }
            if (activeStep === 2 && isKnowledge) {
                handleClose()
            }
        }
        if(mounted){
            doAsync()
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
                        {activeStep > 0 && <IconButton children={<ArrowBack />} onClick={() => setStep(activeStep - 1)} />}
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
                        <CircularProgress onCancel={() => setStep(0)} />
                    }
                </Box>}
                {activeStep === 1 && isKnowledge && <Box>
                        <CircularProgress />
                </Box>}

                {activeStep === 2 && !isKnowledge && <Box
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
                        <Avatar src={assetData && assetData.icon} />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography
                            align='center'
                            color='textPrimary'
                            variant='h3'
                        >
                            Resource '{assetData && assetData.name}' created!
                        </Typography>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography
                            align='center'
                            color='textSecondary'
                            variant='subtitle1'
                        >
                            The resource is now accessible for this task.
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
                                console.log("BUSCAME", assetData)
                                assetData && assetData.link && window.open(assetData.link + "/view", "_blank")
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
                    {selectedInterlinker.softwareinterlinker.preview_text} (it will be not related to project, for features exploration)
                </Button>}
                {downloadable && <Button startIcon={<Download />} sx={{ my: 2, mx: 4 }} autoFocus variant="outlined" color="warning" onClick={() => window.open(selectedInterlinker.link + "/download", "_blank")}>
                    Download locally as resource not related to project (for features exploration)
                </Button>}
                {instantiatable && <LoadingButton loading={loadingKnowledgeInstantiation} startIcon={<DoubleArrow />} sx={{ my: 2, mx: 4 }} autoFocus variant="contained" onClick={() => setStep(1)}>
                    Instantiate as resource to use in project
                </LoadingButton>}
            </DialogActions>}
        </Dialog>
    );
}