import { Avatar, Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import { Check } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import useDependantTranslation from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import TeamProfile from 'pages/dashboard/organizations/TeamProfile';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProcess } from 'slices/process';
import { groupListBy } from 'utils/groupListBy';
import PermissionCreate from './PermissionCreate';


export default function TeamsTab() {
    const { process, updating, treeitems } = useSelector((state) => state.process);
    const dispatch = useDispatch();
    const mounted = useMounted();
    const { t } = useDependantTranslation()
    const [selectedTeam, setSelectedTeam] = React.useState(null)
    const [permissionCreatorOpen, setOpenPermissionCreator] = React.useState(false);
    const [creatingPermission, setCreatingPermission] = React.useState(false);
    const update = () => {
        dispatch(getProcess(process.id, false));
    }
    const permissions_grouped = groupListBy(process.permissions, "team_id")
    //                                     <Button size="small" startIcon={<Avatar variant="rounded" src={permission.team.logotype_link} />} onClick={() => setSelectedTeam(permission.team_id)} variant="contained">{permission.team && permission.team.name} {t("team")}</Button>

    return !updating ? (
        <React.Fragment>
            {selectedTeam && <TeamProfile teamId={selectedTeam} open={selectedTeam ? true : false} setOpen={setSelectedTeam} onChanges={() => console.log("refresh")} />}

            <Table aria-label="admins-table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center"><>{t("Team")}</></TableCell>
                        <TableCell align="center"><>{t("Number of permissions")}</></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.keys(permissions_grouped).map((team_id) => {
                        const permissions = permissions_grouped[team_id]
                        return (
                            <TableRow hover key={team_id}>
                                <TableCell align="center">
                                </TableCell>
                                <TableCell align="center">
                                    {permissions.length}
                                </TableCell>

                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
            <PermissionCreate
                open={permissionCreatorOpen}
                setOpen={setOpenPermissionCreator}
                onCreate={update}
                loading={creatingPermission}
                setLoading={setCreatingPermission}
                coproductionprocess={process}
            />
            <LoadingButton loading={creatingPermission} variant="contained" fullWidth onClick={() => setOpenPermissionCreator(true)}>{t("Create new permission")}</LoadingButton>
        </React.Fragment>) : <CircularProgress />
}