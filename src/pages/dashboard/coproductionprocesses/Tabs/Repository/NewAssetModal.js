import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Stepper,
    Step,
    StepLabel,
    DialogTitle,
    Card,
    CardContent,
    Avatar,
    Typography,
    Select,
    Switch,
    IconButton,
    CircularProgress
} from '@material-ui/core';
import { InterlinkerBrowseFilter, InterlinkerBrowseResults } from 'components/dashboard/interlinkers';
import { Link as RouterLink } from 'react-router-dom';
import { getImageUrl } from 'axiosInstance';
import { ArrowBack, Close } from '@material-ui/icons';

export default function NewAssetModal() {
    const [open, setOpen] = useState(false);
    const [loadingInstantiator, setLoadingInstantiator] = useState(true);
    const [activeStep, _setActiveStep] = useState(0);
    const [selectedInterlinker, setSelectedInterlinker] = useState(null);

    const handleClickOpen = () => {
        setSelectedInterlinker(null)
        setActiveStep(0)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const setActiveStep = (i) => {
        if (i === 0) {
            setSelectedInterlinker(null)
            setLoadingInstantiator(true)
        }
        _setActiveStep(i)
    }

    const handleInterlinkerClick = (interlinker) => {
        console.log(interlinker)
        setSelectedInterlinker(interlinker)
        setActiveStep(1)
    }

    function onMessage(event) {
        // Check sender origin to be trusted
        if (event.origin !== "http://localhost") return;
        const { code, data } = event.data

       
        if (code === "initialized") {
            setLoadingInstantiator(false)
        }
        if (code === "asset_created") {
            console.log("RECEIVED MESSAGE", event.origin, event, code, data)
            /* call POST /coproduction/api/v1/assets/ 
            {
                taskinstantiation_id: currentTaskIns,
                external_id: data.id,
                interlinker_id: selectedInterlinker.id
            }
            */
            setActiveStep(2)
            
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


    return (
        <>
            <Button sx={{ mt: 2 }} variant="contained" fullWidth onClick={handleClickOpen}>Add new asset</Button>
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

                <DialogContent style={{ minHeight: "70vh" }} sx={{
                    alignItems: "center",
                    backgroundColor: 'background.default',
                }}>
                    {/* <Stepper sx={{ mt: 2}} activeStep={activeStep} alternativeLabel>
                        {['Select interlinker', 'Instantiate'].map((label, index) => <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                        )}
                </Stepper>*/}
                    {activeStep === 0 && <>
                        <Box>
                            <InterlinkerBrowseFilter />
                        </Box>
                        <Box sx={{ mt: 6 }}>
                            <InterlinkerBrowseResults onInterlinkerClick={handleInterlinkerClick} />
                        </Box>
                    </>}

                    {activeStep === 1 && <Box sx={{ mt: 2}}>
                        {loadingInstantiator && <CircularProgress />}
                        <iframe style={{ display: loadingInstantiator ? "none" : "block" }} src={`/${selectedInterlinker.backend}/assets/instantiator/`} style={{ width: "100%", minHeight: "60vh", border: 0 }}></iframe>
                    </Box>}

                    {activeStep === 2 && <Box
                        sx={{
                            maxWidth: 450,
                            mx: 'auto',
                            alignItems: "center"
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <Avatar
                                src={getImageUrl("catalogue", selectedInterlinker.logotype)}
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <Typography
                                align='center'
                                color='textPrimary'
                                variant='h3'
                            >
                                Asset created!
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
            </Dialog>
        </>
    );
}