import { Alert, Box, Button, Dialog, Stack, Step, StepLabel, Stepper, Typography } from '@material-ui/core';
import CreateSchema from 'components/dashboard/SchemaSelector';
import { user_id } from 'contexts/CookieContext';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

export default function TimeLine({ }) {
    const { process, hasSchema, tree } = useSelector((state) => state.process);
    const t = useCustomTranslation(process.language)
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const dataFulfilled = process.aim || process.idea || process.challenges
    const administratorsFulfilled = process.administrators_ids.length > 1
    const permissionsFullfilled = process.permissions.length >= 1

    return <Box sx={{ p: 3, justifyContent: "center" }}>
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
                        <Button onClick={() => navigate(`/dashboard/coproductionprocesses/${process.id}/settings`)} size="small" variant="contained" sx={{ maxWidth: "200px" }}>{t("Go to settings section")}</Button>
                    </Stack>
                </StepLabel>
            </Step>
            <Step active completed={administratorsFulfilled}>
                <StepLabel>
                    <Stack spacing={1}>
                        <Typography variant="subtitle1">
                           [{t("OPTIONAL")}] {t("Set coproduction process administrators")}
                        </Typography>
                        {administratorsFulfilled ?
                            <Alert severity="success">{t("The administrators of the coproduction process data has been defined.")} ({process.administrators_ids.length} {t("administrators")})</Alert> :
                            <Alert severity="info">{t("Administrators can update the coproduction proccess information, add permissions to the tree items or add new administrators")}</Alert>}
                        <Button onClick={() => navigate(`/dashboard/coproductionprocesses/${process.id}/settings`)} size="small" variant="contained" sx={{ maxWidth: "200px" }}>{t("Go to settings section")}</Button>
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
                            <Alert severity="success">{t("The schema has been selected. You can delete the resulting coproduction tree in the settings section.")}</Alert> :
                            <Alert severity="info">{t("The schemas are used to create the initial phases, tasks and objectives of the co-production process. From there, the resulting co-production tree can be freely modified. Click on the button and search for the optimal coproduction schema for your process.")}</Alert>}
                        {!hasSchema && <Button disabled={process.creator_id !== user_id} onClick={handleClickOpen} size="small" variant="contained" sx={{ maxWidth: "200px" }}>{t("Select an schema")}</Button>}
                    </Stack>
                </StepLabel>
            </Step>
            <Step active completed={permissionsFullfilled}>
                <StepLabel>
                    <Stack spacing={1}>
                        <Typography variant="subtitle1">
                            {t("Grant permissions over process to co-producer teams and start co-producing through Guide view")}
                        </Typography>
                        {permissionsFullfilled ?
                            <Alert severity="success">{t("At least a permission has been created.")}</Alert> :
                            <Alert severity="info">{t("Now you can permit teams to work on the coproduction process. For that, navigate to the Team section and add a new permission (or do it from the guide view)")}</Alert>}
                        {!permissionsFullfilled && <Button disabled={!hasSchema} onClick={() => navigate(`/dashboard/coproductionprocesses/${process.id}/team`)} size="small" variant="contained" sx={{ maxWidth: "400px" }}>{t("Grant general permissions to team in the team section")}</Button>}
                        {!permissionsFullfilled && <Button disabled={!hasSchema} onClick={() => navigate(`/dashboard/coproductionprocesses/${process.id}/guide`)} size="small" variant="contained" sx={{ maxWidth: "400px" }}>{t("Grant permissions to team for treeitem in the guide section")}</Button>}
                    </Stack>
                </StepLabel>
            </Step>
        </Stepper>

        {!hasSchema && process.creator_id === user_id && <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xl">
            <Box sx={{ minHeight: "93vh" }}>
                <CreateSchema />
            </Box>
        </Dialog>}
    </Box>
}