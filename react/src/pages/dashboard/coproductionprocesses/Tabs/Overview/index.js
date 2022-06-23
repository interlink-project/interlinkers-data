import { Alert, AppBar, Box, Button, Card, Dialog, Stack, Step, StepButton, StepLabel, Stepper, Typography } from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import { StatusChip } from 'components/dashboard/assets/Icons';
import CreateSchema from 'components/dashboard/SchemaSelector';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import moment from "moment";
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { setSelectedTreeItem } from 'slices/process';

const DoneAlert = ({ t, date = null }) => {
    return <Alert sx={{ mt: 1 }} severity="success">{date ? t("Done on", { date: moment(date).fromNow() }) : t("Done")}</Alert>
}

const WarningAlert = ({ t, explanation }) => {
    return <Alert sx={{ mt: 1 }} severity="warning">{explanation}</Alert>
}

const PhaseStep = ({ processId, phase, t }) => {
    const [open, setOpen] = React.useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    return <> <Step key={phase.id} active completed={phase.status === "finished"}>
        <StepButton color="inherit" onClick={() => setOpen(!open)}>
            <Stack direction="row" alignItems="center">
                {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />} {t("Complete phase {{phase}}", { phase: phase.name })}
            </Stack>
        </StepButton>
    </Step>
        {open && <Card sx={{p: 3}}>
        <Stepper nonLinear orientation="vertical">
        {phase.children.map(objective => <Step key={objective.id} active completed={objective.status === "finished"}>
                <StepLabel>
                <Box sx={{maxWidth: 400}}>
                        <Button variant="text" onClick={() => {
                            dispatch(setSelectedTreeItem(objective))
                            navigate(`/dashboard/coproductionprocesses/${processId}/guide`)
                        }}>
                        <Typography variant="subtitle1">
                            {objective.name}
                        </Typography>
                        </Button>
                        <br />
                        
                        <StatusChip status={objective.status} />

                        </Box>
                </StepLabel>
            </Step>)}
            </Stepper>
        </Card>}
    </>
}

export default function TimeLine({ }) {
    const { process, isAdministrator, hasSchema, tree } = useSelector((state) => state.process);
    const t = useCustomTranslation(process.language)
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    if (!process || !tree) {
        return
    }

    const dataFulfilled = process.aim || process.idea || process.challenges
    const administratorsFulfilled = process.administrators_ids.length > 1

    return <Box sx={{ pb: 3, justifyContent: "center" }}>

        <AppBar sx={{ position: 'relative' }}>
            <Typography variant="h6" sx={{ p: 2 }}>
                {t("Coproduction process overview")}
            </Typography>
        </AppBar>
        <Stepper nonLinear activeStep={0} orientation="vertical" sx={{ mx: 2, mt: 2 }}>
            <Step active completed={dataFulfilled ? true : false}>
                <StepLabel>
                    <Stack spacing={1}>
                        <Typography variant="subtitle1">
                            {t("Set coproduction process data")}
                        </Typography>
                        {dataFulfilled ?
                            <Alert severity="success">{t("The coproduction process data has been defined.")}</Alert> :
                            <Alert severity="info">{t("The co-production process data are a set of attributes that serve to define the process to be carried out.")}</Alert>}
                        {!dataFulfilled && <Button disabled={!isAdministrator} onClick={() => navigate(`/dashboard/coproductionprocesses/${process.id}/settings`)} size="small" variant="contained" sx={{ maxWidth: "200px" }}>{t("Go to settings")}</Button>}
                    </Stack>
                </StepLabel>
            </Step>
            <Step active completed={hasSchema}>
                <StepLabel>
                    <Stack spacing={1}>
                        <Typography variant="subtitle1">
                            {t("Select the coproduction schema")}
                        </Typography>
                        {hasSchema ?
                            <Alert severity="success">{t("The schema has been selected.")}</Alert> :
                            <Alert severity="info">{t("The schemas are used to create the initial phases, tasks and objectives of the co-production process. From there, the resulting co-production tree can be freely modified. Click on the button and search for the optimal coproduction schema for your process.")}</Alert>}
                        {!hasSchema && <Button disabled={!isAdministrator} onClick={handleClickOpen} size="small" variant="contained" sx={{ maxWidth: "200px" }}>{t("Select an schema")}</Button>}
                    </Stack>
                </StepLabel>
            </Step>
            <Step active completed={administratorsFulfilled}>
                <StepLabel>
                    <Stack spacing={1}>
                        <Typography variant="subtitle1">
                            {t("Set coproduction process administrators")}
                        </Typography>
                        {administratorsFulfilled ?
                            <Alert severity="success">{t("The administrators of the coproduction process data has been defined.")} ({process.administrators_ids.length} {t("administrators")})</Alert> :
                            <Alert severity="info">{t("Administrators can update the coproduction proccess information, add permissions to the tree items or add new administrators")}</Alert>}
                        {!administratorsFulfilled && <Button disabled={!isAdministrator} onClick={() => navigate(`/dashboard/coproductionprocesses/${process.id}/settings`)} size="small" variant="contained" sx={{ maxWidth: "200px" }}>{t("Go to settings")}</Button>}
                    </Stack>
                </StepLabel>
            </Step>
            {tree.map((phase) => !phase.is_disabled && <PhaseStep key={phase.id} processId={process.id} t={t} phase={phase} />)}

            {(!tree || tree.length === 0) && ["1", "2", "3", "4"].map((phase) => <Step key={phase}>
                <StepLabel />
            </Step>)}
            <Step>
                <StepLabel>
                    {t("Process completion")}
                </StepLabel>
            </Step>
        </Stepper>

        {!hasSchema && <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xl">
            <Box sx={{ minHeight: "93vh" }}>
                <CreateSchema />
            </Box>
        </Dialog>}
    </Box>
}