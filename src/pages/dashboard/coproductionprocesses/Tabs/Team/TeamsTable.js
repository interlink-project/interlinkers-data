import { Avatar, Button, Select, AvatarGroup, Paper, Table, TableCell, TableContainer, TableHead, TableRow, TableBody, IconButton, Typography, Collapse, Box, MenuItem, Alert, Stack } from '@material-ui/core';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardArrowUp as KeyboardArrowUpIcon, KeyboardArrowDown as KeyboardArrowDownIcon, Remove, Save, Edit, Delete } from '@material-ui/icons';
import TeamAdd from './TeamAdd';
import { LoadingButton } from '@material-ui/lab';
import { useNavigate } from 'react-router';
import { rolesApi } from '__fakeApi__';
import UserData from 'components/UserData';


function MemberRow({ user, acl, onChanges }) {
    const { process } = useSelector((state) => state.process);
    const { roles } = acl
    const role = roles.find(role => role.membership_ids.includes(user.id)) || roles.find(el => el.id === acl.default_role_id)
    const [editMode, setEditMode] = React.useState(false);
    const [newRole, setNewRole] = React.useState(role.id);
    const [loading, setLoading] = React.useState(false);

    const updateRole = () => {
        setLoading(true)
        rolesApi.switch({
            "new_role": newRole,
            "old_role": role.id,
            "user_id": user.id

        }).then((res) => {
            onChanges(res)
            setEditMode(false)
        }).finally(() => setLoading(false))
    }

    return <TableRow key={user.id}>
        <TableCell align="center">
            <Avatar src={user.picture} />

        </TableCell>
        <TableCell align="center">
            {user.created_at}
        </TableCell>
        <TableCell align="center">
            {editMode ? <Select
                value={newRole}
                label="Role"
                onChange={(e) => setNewRole(e.target.value)}
            >

                {roles.filter(role => role.selectable).map(role => <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>)}
            </Select> : role.name}
        </TableCell>
        <TableCell align="center">{user.email}</TableCell>
        <TableCell align="center">
            {editMode ? <>
                <LoadingButton loading={loading} size="small" onClick={updateRole}>
                    <Save fontSize="small" />
                </LoadingButton>
                <IconButton size="small" onClick={() => setEditMode(false)}>
                    <Remove fontSize="small" />
                </IconButton>
            </> :
                <>
                    {process.creator_id !== user.user_id ? <IconButton size="small" onClick={() => setEditMode(true)}>
                        <Edit fontSize="small" />
                    </IconButton> : <Alert severity="warning">Is the creator</Alert>}

                </>
            }
        </TableCell>
    </TableRow>
}
function TeamRow({ team }) {
    const navigate = useNavigate()
    const { roles, teams } = useSelector((state) => state.process);

    const deleteTeam = () => {
        console.log(team.id, "delete")
    }

    const teamRole = roles.find(r => r.teams && r.teams.find(t => t.id === team.id))

    return (
        <React.Fragment>
            <TableRow hover>
                <TableCell align="center">
                    <Avatar src={team.logotype_link} />
                </TableCell>
                <TableCell align="center">

                    <Button variant="text" fullWidth onClick={() => navigate(`/dashboard/teams/${team.id}`)}>
                        {team.name}
                    </Button>


                </TableCell>
                <TableCell align="center">
                    {teamRole.name}
                </TableCell>
                <TableCell align="center">
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >

                        {team && <AvatarGroup max={4}>
                            {team && team.users.map(user => <UserData sx={{ height: "30px", width: "30px", border: "0px" }} variant="avatar" id={user.id} />)}

                        </AvatarGroup>}
                        ({team.users.length})
                    </Box>

                </TableCell>
                <TableCell align="center">
                    {teams.length > 1 && <IconButton size="small" onClick={deleteTeam}>
                        <Delete fontSize="small" />
                    </IconButton>}
                    <IconButton size="small" onClick={deleteTeam}>
                        <Edit fontSize="small" />
                    </IconButton>
                </TableCell>

            </TableRow>
        </React.Fragment>
    );
}

export default function TeamsTable({onChanges}) {
    const { teams } = useSelector((state) => state.process);

    return <TableContainer component={Paper}>

        <Table aria-label="collapsible table" size='medium'>
            <TableHead>
                <TableRow>
                    <TableCell />
                    <TableCell align="center">Name</TableCell>
                    <TableCell align="center">Role</TableCell>
                    <TableCell align="center">Members</TableCell>
                    <TableCell align="center">Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {teams.map((team) => (
                    <TeamRow key={team.id} team={team} />
                ))}
            </TableBody>
        </Table>

        <TeamAdd currentTeams={teams} onChanges={onChanges} />
    </ TableContainer>
}