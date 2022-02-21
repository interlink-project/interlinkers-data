import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Avatar,
    Typography,
    IconButton,
    CircularProgress,
    AvatarGroup
} from '@material-ui/core';
import axiosInstance from 'axiosInstance';
import { ArrowBack, Close } from '@material-ui/icons';
import { assetsApi } from '__fakeApi__';
import RepresentationsList from './RepresentationList';
import { env } from 'configuration';

/*
import IframeResizer from 'iframe-resizer-react'
 <IframeResizer
                            log
                            src={`${selectedInterlinker.backend}/assets/instantiate`}
                            autoResize
                            style={{ width: '1px', minWidth: '100%', border: 0, display: loadingInstantiator ? "none" : "block" }}
                        />

                        */
export default function NewAssetModal({ open, setOpen, selectedInterlinker, task, onCreate }) {
    const [loadingInstantiator, setLoadingInstantiator] = useState(true);
    const [activeStep, _setActiveStep] = useState(0);
    const [result, setResult] = useState(null);

    const handleClose = () => {
        setOpen(false);
    };

    const setActiveStep = (i) => {
        if (i === 0) {
            setLoadingInstantiator(true)
        }
        _setActiveStep(i)
    }

    const onAssetCreate = async (data, interlinker_id) => await assetsApi.create(
        task.id,
        interlinker_id,
        data.id || data._id,
    );

    const onFinish = (result) => {
        var data
        if (Array.isArray(result) && result.length < 2) {
            data = result[0]
        } else {
            data = result
        }
        setResult(data)
        setActiveStep(1)
        onCreate()
    }

    async function onMessage(event) {
        // Check sender origin to be trusted
        if (event.origin !== env.REACT_APP_COMPLETE_DOMAIN) return;
        const { code, data } = event.data


        if (code === "initialized") {
            setLoadingInstantiator(false)
        }
        if (code === "asset_created") {
            console.log("RECEIVED MESSAGE", event.origin, event, code, data)
            //task_id, interlinker_id, external_id
            const coproduction_response = await onAssetCreate(data, selectedInterlinker.id)
            // TODO: if fails
            const interlinker_response = await axiosInstance.get(coproduction_response.link)
            onFinish(interlinker_response.data)
        }
    }

    useEffect(() => {
        // https://stackoverflow.com/questions/2161388/calling-a-parent-window-function-from-an-iframe
        if (window.addEventListener) {  // all browsers except IE before version 9
            window.addEventListener("message", onMessage, false);
        }
        else if (window.attachEvent) {
            window.attachEvent("onmessage", onMessage, false);
        }


        return () => {
            if (window.addEventListener) {
                window.removeEventListener("message", onMessage, false);
            }
            else if (window.attachEvent) {
                window.attachEvent("onmessage", onMessage, false);
            }
        }
    }, [selectedInterlinker]);

    const getHeight = () => {
        if(activeStep === 0){
            return selectedInterlinker.nature === "softwareinterlinker" ? "70vh" : "50vh"
        }
        return "40vh"
    }

    const variousAssetsInstantiated = Array.isArray(result)

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
            }}>
                <Box sx={{
                    justifyContent: "space-between",
                }}>
                    {activeStep > 0 && <IconButton children={<ArrowBack />} onClick={() => setActiveStep(activeStep - 1)} />}
                    <IconButton children={<Close />} onClick={handleClose} />

                </Box>

            </DialogTitle>

            <DialogContent style={{ minHeight: getHeight() }} sx={{
                alignItems: "center",
                backgroundColor: 'background.default',
            }}>
                {/* <Stepper sx={{ mt: 2}} activeStep={activeStep} alternativeLabel>
                        {['Select interlinker', 'Instantiate'].map((label, index) => <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                        )}
                </Stepper>*/}
                {activeStep === 0 && <Box>
                    {selectedInterlinker.nature === "softwareinterlinker" &&
                        <>
                            {loadingInstantiator && <CircularProgress />}
                            <iframe style={{ display: loadingInstantiator ? "none" : "block" }} src={`${selectedInterlinker.backend}/instantiate`} style={{ width: "100%", minHeight: "60vh", border: 0 }}></iframe>
                        </>
                    }
                    {selectedInterlinker.nature === "knowledgeinterlinker" &&
                        <Box
                            sx={{
                                position: 'absolute', left: '50%', top: '50%', width: "100%",
                                transform: 'translate(-50%, -50%)', p: 10
                            }}
                        >
                            <RepresentationsList representations={selectedInterlinker.representations} onAssetCreate={onAssetCreate} onFinish={onFinish} />
                        </Box>
                    }
                </Box>}

                {activeStep === 1 && <Box
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
                        {variousAssetsInstantiated
                            ?
                            <AvatarGroup max={4}>
                                {result.map((el, i) => <Avatar key={`result${i}`} src={el.icon} />)}
                            </AvatarGroup>

                            : <Avatar src={result.icon} />
                        }

                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography
                            align='center'
                            color='textPrimary'
                            variant='h3'
                        >
                            {variousAssetsInstantiated ?
                                "Assets created!"
                                :
                                <>Asset '{result.name}' created!</>
                            }
                        </Typography>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography
                            align='center'
                            color='textSecondary'
                            variant='subtitle1'
                        >
                            {variousAssetsInstantiated ?
                                "The assets are now accessible for this task."
                                :
                                <>The asset is now accessible for this task.</>
                            }

                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 2,
                        }}
                    >
                        {!variousAssetsInstantiated && <Button
                            color='primary'
                            variant='contained'
                            onClick={() => {
                                window.open(result.viewLink, "_blank")
                                handleClose()
                            }}
                        >
                            Open asset
                        </Button>}

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
        </Dialog>
    );
}