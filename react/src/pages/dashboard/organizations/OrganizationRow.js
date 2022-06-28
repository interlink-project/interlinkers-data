import { Avatar, AvatarGroup, Chip, Paper, Stack, TableCell, TableRow } from '@material-ui/core';
import { Check, KeyboardArrowDown, KeyboardArrowUp, People } from '@material-ui/icons';
import UserAvatar from 'components/UserAvatar';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';

function OrganizationRow({ organization, collapseElement }) {
    const { t } = useTranslation()
    const [open, setOpen] = React.useState(false);
    return (
        <React.Fragment>
            <TableRow hover={!open} sx={{ '& > *': { borderBottom: 'unset' }, cursor: 'pointer' }} onClick={() => {
                setOpen(!open)
            }}>
                <TableCell align="center" component="th" scope="row">
                    <Stack alignItems="center" direction="row" spacing={1}>
                        {organization.logotype_link ? <Avatar sx={{ height: "25px", width: "25px" }} variant="rounded" src={organization.logotype_link} /> : <People />}
                        <b>{organization.name}</b>
                    </Stack>
                </TableCell>
                <TableCell align="center" component="th" scope="row">
                    {organization.public && <Check />}
                </TableCell>
                <TableCell align="center" component="th" scope="row">
                    <AvatarGroup>
                        {organization.administrators.map(admin => <UserAvatar key={admin.id} sx={{ width: 30, height: 30 }} user={admin} />)}
                    </AvatarGroup>
                </TableCell>
                <TableCell align="center">{moment(organization.created_at).fromNow()}</TableCell>
                <TableCell align="center">{organization.teams_ids.length}</TableCell>
                <TableCell align="center">
                    {organization.current_user_participation.length > 0 ? organization.current_user_participation.map(p => <Chip size="small" sx={{ ml: 1 }} key={organization.id + p} variant={p === "administrator" ? "contained" : "outlined"} label={p} />) : <Chip label={t("None")} />}
                </TableCell>
                <TableCell align="center">
                    {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ border: 0, paddingTop: !open && 0, paddingBottom: !open && 0 }} sx={{ bgcolor: "background.default" }} colSpan={7}>
                    <Paper>
                        {open && collapseElement}
                    </Paper>
                </TableCell>
            </TableRow >
        </React.Fragment >
    );
}

export default OrganizationRow;
