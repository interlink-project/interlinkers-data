import { Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import UserData from 'components/UserData';
import useDependantTranslation from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function TeamsTab() {
    const { process, updating } = useSelector((state) => state.process);
    const dispatch = useDispatch();
    const mounted = useMounted();
    const { t } = useDependantTranslation()

    // <TeamsTable onChanges={updateAcl} />
    // <Divider sx={{ my: 2 }} />
    return !updating ? (
        <React.Fragment>
            <TableContainer component={Paper}>
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
                                    {permission.team_id}
                                </TableCell>
                                <TableCell align="center">
                                    {permission.treeitem_id}
                                </TableCell>
                                <TableCell align="center">
                                    {permission.access_assets_permission}
                                </TableCell>
                                <TableCell align="center">
                                    {permission.access_assets_permission}
                                </TableCell>
                                <TableCell align="center">
                                    {permission.access_assets_permission}
                                </TableCell>
                                <TableCell align="center">
                                    {permission.access_assets_permission}
                                </TableCell>
                                <TableCell align="center">
                                    {permission.access_assets_permission}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Box sx={{textAlign: "center", my: 4}}>
                <Button variant="contained">
                    {t("Add rule")}
                </Button>
                </Box>
                

            </TableContainer>
        </React.Fragment>) : <CircularProgress />
}