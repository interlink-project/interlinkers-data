import { Avatar, AvatarGroup, Box, Button, Card, CardActions, Grid, IconButton, MenuItem, Select, Skeleton, Table, TableBody, TableCell, TableHead, TableRow, Typography, TableContainer, Paper } from '@material-ui/core';
import { Delete, Edit, Remove, Save } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import UserData from 'components/UserData';
import useMounted from 'hooks/useMounted';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { rolesApi, usersApi } from '__api__';
import IndividualAdd from './IndividualAdd';
import TeamAdd from './TeamAdd';

function Row({ obj: ob, onChanges, isTeam = false }) {
    const navigate = useNavigate()
    const [obj, setObj] = useState(ob)
    const { process, roles, teams } = useSelector((state) => state.process);
    const mounted = useMounted()
    const currentRole = roles.find(r => ob.role_id === r.id)
    const [editMode, setEditMode] = useState(false);
    const [newRole, setNewRole] = useState(currentRole && currentRole.id);
    const [loading, setLoading] = useState(false);

    const updateRole = () => {
        setLoading(true)
        const data = {
            "new_role": newRole,
            "old_role": currentRole.id
        }
        data[isTeam ? "team_id" : "user_id"] = obj.id

        rolesApi.switchRole(data).then((res) => {
            onChanges && onChanges(res)
            setEditMode(false)
        }).finally(() => setLoading(false))
    }

    const canDelete = isTeam || (!isTeam && ob.id !== process.creator_id)
    
    const handleDelete = () => {
        if (canDelete) {
            setLoading(true)
            if (isTeam) {
                rolesApi.removeTeam(ob.role_id, ob.id).then(res => {
                    setLoading(false)
                    onChanges && onChanges()
                })
            } else {
                rolesApi.removeUser(ob.role_id, ob.id).then(res => {
                    setLoading(false)
                    onChanges && onChanges()
                })
            }
        }
    }

    useEffect(() => {
        if (!isTeam && mounted) {
            setLoading(true)
            usersApi.get(obj.id).then(res => {
                if (mounted) {
                    setObj({ ...res.data, ...ob })
                    setLoading(false)
                }

            })
        }
    }, [ob, isTeam, mounted])

    const Actions = () => <TableCell align="center">
        {editMode ? <>
            <LoadingButton loading={loading} size="small" onClick={updateRole}>
                <Save fontSize="small" />
            </LoadingButton>
            <IconButton size="small" onClick={() => setEditMode(false)}>
                <Remove fontSize="small" />
            </IconButton>
        </> :
            <>
                {canDelete && <IconButton size="small" onClick={handleDelete}>
                    <Delete fontSize="small" />
                </IconButton>}
                {canDelete && <IconButton size="small" onClick={() => setEditMode(true)}>
                    <Edit fontSize="small" />
                </IconButton>}
            </>
        }
    </TableCell>

    const RoleSelector = () => editMode ? <Select
        value={newRole}
        label="Role"
        onChange={(e) => setNewRole(e.target.value)}
    >
        {roles.filter(role => role.selectable).map(role => <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>)}
    </Select> : <>{currentRole && currentRole.name}</>

    if (isTeam) {
        return (<TableRow hover key={ob.id}>
            <TableCell align="center">
                <Avatar src={obj.logotype_link} />
            </TableCell>
            <TableCell align="center">
                <Button variant="text" fullWidth onClick={() => navigate(`/dashboard/teams/${obj.id}`)}>
                    {obj.name}
                </Button>
            </TableCell>
            <TableCell align="center">
                <RoleSelector />
            </TableCell>
            <TableCell align="center">
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <AvatarGroup max={4}>
                        {obj && obj.users.map(user => <UserData sx={{ height: "30px", width: "30px", border: "0px" }} variant="avatar" id={user.id} />)}

                    </AvatarGroup>
                    ({obj.users.length})
                </Box>
            </TableCell>
            <Actions />
        </TableRow>
        );
    }
    else if (loading) {
        return (<TableRow hover key={ob.id}>
            <TableCell align="center">
                <Skeleton />
            </TableCell>
            <TableCell align="center">
                <Skeleton />
            </TableCell>
            <TableCell align="center">
                <Skeleton />
            </TableCell>
            <TableCell align="center">
                <Skeleton />
            </TableCell>
            <Actions />
        </TableRow>)
    }
    return (<TableRow hover key={ob.id}>
        <TableCell align="center">
            <Avatar src={obj.picture} />
        </TableCell>
        <TableCell align="center">
            {obj.full_name}
        </TableCell>
        <TableCell align="center">
            <RoleSelector />
        </TableCell>
        <TableCell align="center">
            {obj.email}

        </TableCell>
        <Actions />
    </TableRow>
    );
}

const sameHeightCards = {
    minHeight: "200px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
}

export default function TeamsTable({ onChanges }) {
    const { teams, users } = useSelector((state) => state.process);
    const [teamsOpen, setTeamsOpen] = useState(false);
    const [individualsOpen, setIndividualsOpen] = useState(false);

    return <Grid container spacing={1}>
        <TeamAdd currentTeams={teams} open={teamsOpen} setOpen={setTeamsOpen} onChanges={onChanges} />
        <IndividualAdd open={individualsOpen} setOpen={setIndividualsOpen} onChanges={onChanges} />
        <Grid item lg={6} xs={12}>
            <TableContainer component={Paper} style={sameHeightCards}>
                <Table aria-label="teams-table" size='small'>
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
                            <Row key={team.id} obj={team} onChanges={onChanges} isTeam />
                        ))}
                    </TableBody>
                </Table>
                <CardActions sx={{ justifyContent: "center", textAlign: "center" }}>
                    <Button variant="contained" sx={{ my: 2 }} color='primary' onClick={() => setTeamsOpen(true)}>
                        Add new team
                    </Button>
                </CardActions>
            </TableContainer>
        </Grid>
        <Grid item lg={6} xs={12}>
        <TableContainer component={Paper} style={sameHeightCards}>
                <Table aria-label="users-table" size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Role</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.length > 0 ? users.map((user) => (
                            <Row key={user.id} obj={user} onChanges={onChanges} />
                        )) : <Typography
                            align='center'
                            color='textSecondary'
                            variant='subtitle1'
                        >
                            Empty
                        </Typography>}
                    </TableBody>
                </Table>
                <CardActions sx={{ justifyContent: "center", textAlign: "center" }}>
                    <Button variant="contained" sx={{ my: 2 }} color='primary' onClick={() => setIndividualsOpen(true)}>
                        Add new individual
                    </Button>
                </CardActions>
            </TableContainer>
        </Grid>
    </Grid>
}