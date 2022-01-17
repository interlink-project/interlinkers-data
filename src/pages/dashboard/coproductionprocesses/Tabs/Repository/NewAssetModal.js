import * as React from 'react';
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
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Switch
} from '@material-ui/core';
import { InterlinkerBrowseFilter, InterlinkerBrowseResults } from 'components/dashboard/interlinkers';

export default function NewAssetModal() {
    const [open, setOpen] = React.useState(false);
    const [activeStep, setActiveStep] = React.useState(0);
    const [selectedInterlinker, setSelectedInterlinker] = React.useState(null);

    const handleClickOpen = () => {
        setSelectedInterlinker(null)
        setActiveStep(0)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleInterlinkerClick = (interlinker) => {
        console.log(interlinker)
        setSelectedInterlinker(interlinker)
        setActiveStep(1)
    }

    return (
        <React.Fragment>
            <Button sx={{ mt: 2 }} variant="contained" fullWidth onClick={handleClickOpen}>Add new asset</Button>
            <Dialog
                fullWidth
                maxWidth="lg"
                open={open}
                // onClose={handleClose}

            >
                <DialogTitle>Asset creation dialog</DialogTitle>
                <DialogContent style={{ minHeight: "60vh" }} sx={{

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

                    {activeStep === 1 && <Box sx={{ mt: 2 }}>
                        <iframe src={`/${selectedInterlinker.backend}/api/v1/assets/instantiator/`} style={{ width: "100%", minHeight: "60vh", border: 0 }}></iframe>
                    </Box>}

                </DialogContent>
                <DialogActions>
                    {activeStep === 1 && <Button variant="contained" onClick={() => setActiveStep(0)}>Previous</Button>}
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}