import {
    Avatar, AvatarGroup, Box,
    Button, CircularProgress as MuiCircularProgress, Dialog, DialogActions, DialogContent,
    DialogTitle, Grid, IconButton, Typography
} from '@material-ui/core';
import { ArrowBack, Close } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import { env } from 'configuration';
import InterlinkerHeader from 'pages/dashboard/interlinkers/InterlinkerHeader';
import { useEffect, useState } from 'react';
import { assetsApi, knowledgeInterlinkersApi } from '__fakeApi__';
import InterlinkerDetails from "../../../interlinkers/InterlinkerDetails";

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
export default function NewAssetModal({ open, setOpen, selectedInterlinker, task, onCreate }) {
    const [loadingInstantiator, setLoadingInstantiator] = useState(true);
    const [activeStep, _setActiveStep] = useState(0);
    const [assetData, setAssetData] = useState(null);
    const [loadingKnowledgeInstantiation, setLoadingKnowledgeInstantiation] = useState(false);

    const open_in_modal = selectedInterlinker.nature === "softwareinterlinker" && selectedInterlinker.integration && selectedInterlinker.integration.open_in_modal
    const downloadable = selectedInterlinker.nature === "knowledgeinterlinker" && selectedInterlinker.softwareinterlinker.integration && selectedInterlinker.softwareinterlinker.integration.download

    const handleClose = () => {
        setOpen(false);
    };

    const setActiveStep = (i) => {
        if (i === 1) {
            setLoadingInstantiator(true)
        }
        _setActiveStep(i)
    }

    const onAssetCreate = async (data, softwareinterlinker_id, knowledgeinterlinker_id) => await assetsApi.create(
        task.id,
        softwareinterlinker_id,
        knowledgeinterlinker_id,
        data.id || data._id,
    );

    const onFinish = (result) => {
        var data
        if (Array.isArray(result) && result.length < 2) {
            data = result[0]
        } else {
            data = result
        }
        setAssetData(data)
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
            if (window.addEventListener) {  // all browsers except IE before version 9
                window.addEventListener("message", onMessage, false);
            }
            else if (window.attachEvent) {
                window.attachEvent("onmessage", onMessage, false);
            }
            if (selectedInterlinker.nature === "softwareinterlinker" && !open_in_modal) {
                window.open(`${selectedInterlinker.backend}/instantiate`)
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
            return selectedInterlinker.nature === "softwareinterlinker" ? "70vh" : "50vh"
        }
        return "40vh"
    }

    return (
        <Dialog
            fullWidth
            maxWidth="lg"
            open={open}
        // onClose={handleClose}

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
                {/* <Stepper sx={{ mt: 2}} activeStep={activeStep} alternativeLabel>
                        {['Select interlinker', 'Instantiate'].map((label, index) => <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                        )}
                </Stepper>*/}

                {activeStep === 0 && <Box>
                    <InterlinkerDetails interlinker={selectedInterlinker} />
                </Box>}

                {activeStep === 1 && <Box>
                    {/* If software interlinker */}
                    {selectedInterlinker.nature === "softwareinterlinker" && open_in_modal &&
                        <>
                            {loadingInstantiator && <CircularProgress text="Loading instantiator..." />}
                            <iframe style={{ display: loadingInstantiator ? "none" : "block" }} src={`${selectedInterlinker.backend}/instantiate`} style={{ width: "100%", minHeight: "60vh", border: 0 }}></iframe>
                        </>
                    }
                    {selectedInterlinker.nature === "softwareinterlinker" && !open_in_modal &&
                        <CircularProgress onCancel={() => setActiveStep(0)} />
                    }
                    {/* If knowledge interlinker */}
                    {selectedInterlinker.nature === "knowledgeinterlinker" &&
                        <Box
                            sx={{
                                position: 'absolute', left: '50%', top: '50%', width: "100%",
                                transform: 'translate(-50%, -50%)', p: 10,
                                textAlign: 'center'
                            }}
                        >
                            <Typography variant="h5">Are you sure you want to instantiate this interlinker?</Typography>
                            <LoadingButton loading={loadingKnowledgeInstantiation} color="success" size="large" sx={{mt: 2}} onClick={async () => {
                                setLoadingKnowledgeInstantiation(true)
                                const interlinker_asset = await knowledgeInterlinkersApi.instantiate(selectedInterlinker.id)
                                const coproduction_asset = await onAssetCreate(interlinker_asset, selectedInterlinker.softwareinterlinker_id, selectedInterlinker.id)
                                setLoadingKnowledgeInstantiation(false)

                                // TODO: if fails
                                onFinish({ ...coproduction_asset, ...interlinker_asset })
                            }}>
                                Proceed
                            </LoadingButton>
                        </Box>
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
            {activeStep === 0 && <DialogActions sx={{bgcolor: "background.default"}}> 
            {downloadable && <Button sx={{ my: 2, mx: 4 }} autoFocus fullWidth variant="contained" color="warning" onClick={() => window.open(selectedInterlinker.link + "/download", "_blank")}>
                    Download
                </Button>}
                <Button sx={{ my: 2, mx: 4 }} autoFocus fullWidth variant="contained" onClick={() => setActiveStep(1)}>
                    Launch interlinker
                </Button>
                
            </DialogActions>}
        </Dialog>
    );
}