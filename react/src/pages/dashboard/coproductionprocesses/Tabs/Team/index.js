import { Avatar, Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import { Check } from '@material-ui/icons';
import useDependantTranslation from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import TeamProfile from 'pages/dashboard/organizations/TeamProfile';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { groupListBy } from 'utils/groupListBy';


export default function TeamsTab() {
    const { process, updating, treeitems } = useSelector((state) => state.process);
    const dispatch = useDispatch();
    const mounted = useMounted();
    const { t } = useDependantTranslation()
    const [selectedTeam, setSelectedTeam] = React.useState(null)
    
    
    return !updating ? (
        <React.Fragment>
            {selectedTeam && <TeamProfile teamId={selectedTeam} open={selectedTeam ? true : false} setOpen={setSelectedTeam} onChanges={() => console.log("refresh")} />}

                <Table aria-label="admins-table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center"><>{t("Team")}</></TableCell>
                            <TableCell align="center"><>{t("Tree item")}</></TableCell>
                            <TableCell align="center"><>{t("Access to resources")}</></TableCell>
                            <TableCell align="center"><>{t("Create assets")}</></TableCell>
                            <TableCell align="center"><>{t("Delete assets")}</></TableCell>
                            <TableCell align="center"><>{t("Update tree items")}</></TableCell>
                            <TableCell align="center"><>{t("Delete tree items")}</></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {process.permissions.map((permission) => (
                            <TableRow hover key={permission.id}>
                                <TableCell align="center">
                                    <Button size="small" startIcon={<Avatar variant="rounded" src={permission.team.logotype_link} />} onClick={() => setSelectedTeam(permission.team_id)} variant="contained">{permission.team && permission.team.name} {t("team")}</Button>
                                </TableCell>
                                <TableCell align="center">
                                    {permission.treeitem_id}
                                </TableCell>
                                <TableCell align="center">
                                    {permission.access_assets_permission && <Check />}
                                </TableCell>
                                <TableCell align="center">
                                    {permission.access_assets_permission && <Check />}
                                </TableCell>
                                <TableCell align="center">
                                    {permission.access_assets_permission && <Check />}
                                </TableCell>
                                <TableCell align="center">
                                    {permission.access_assets_permission && <Check />}
                                </TableCell>
                                <TableCell align="center">
                                    {permission.access_assets_permission && <Check />}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
        </React.Fragment>) : <CircularProgress />
}