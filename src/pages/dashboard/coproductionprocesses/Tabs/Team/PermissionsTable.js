import { Stack, Switch, Chip, Paper, Table, TableCell, TableContainer, TableHead, TableRow, TableBody, IconButton, TextField, Collapse, Box } from '@material-ui/core';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardArrowUp as KeyboardArrowUpIcon, KeyboardArrowDown as KeyboardArrowDownIcon, Check, Edit, Delete, Save, Remove, Close } from '@material-ui/icons';
import RoleCreate from './RoleCreate';
import { LoadingButton } from '@material-ui/lab';
import { rolesApi } from '__fakeApi__';


const permissions = [
    {
        "code": "assets_create",
        "label": "Create assets"
    },
    {
        "code": "assets_update",
        "label": "Update assets"
    },
    {
        "code": "assets_delete",
        "label": "Delete assets"
    },
    {
        "code": "acl_update",
        "label": "Update access control"
    },
    {
        "code": "process_update",
        "label": "Update process metadata"
    },
]

function Row(props) {
    const { role, onChanges } = props;
    const [editMode, setEditMode] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [newName, setNewName] = React.useState(role.name);
    const [newDescription, setNewDescription] = React.useState(role.description);
    const [newPermissions, setNewPermissions] = React.useState(role.permissions);

    const PermittedChip = () => <Chip
        color="success"
        size="small"
        onDelete={console.log}
        icon={<Check />}
    />
    const NotPermittedChip = () => <Chip
        size="small"
        icon={<Close />}
        onDelete={console.log}
    />

    const deleteRole = () => {
        setLoading(true)
        rolesApi.delete(role.id).then(res => {
            onChanges(res)
        }).finally(() => setLoading(false))
    }

    const update = () => {
        setLoading(true)
        rolesApi.update(role.id, {
            name: newName,
            description: newDescription,
            permissions: newPermissions
        }).then(res => {
            onChanges(res)
            setEditMode(false)
        }).finally(() => setLoading(false))
    }

    const handleSwitch = (e, permission) => {
        const checked = e.target.checked
        if (checked) {
            setNewPermissions([...newPermissions, permission])
        } else {
            setNewPermissions([...newPermissions.filter(el => el !== permission)])
        }
    }

    return (
        <React.Fragment>
            <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    {editMode && role.meta_editable ? <TextField
                        required
                        label="Description"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        variant="standard"
                        fullWidth
                    /> : role.name}
                </TableCell>
                <TableCell>
                    {editMode && role.meta_editable ? <TextField
                        required
                        label="Description"
                        defaultValue={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        variant="standard"
                        multiline
                        fullWidth
                    /> : role.description}
                </TableCell>
                {permissions.map(perm => {
                    const active = role.permissions.findIndex(pr => pr === perm.code) >= 0
                    return <TableCell key={perm.code} align="center">
                        {editMode && role.perms_editable ? <Switch color="success" defaultChecked={active} onChange={(e) => handleSwitch(e, perm.code)} /> : active ? <PermittedChip /> : <NotPermittedChip />}


                    </TableCell>
                })}
                <TableCell>
                    <Stack direction="row">
                        {editMode ? <>
                            <LoadingButton loading={loading} size="small" onClick={update}>
                                <Save fontSize="small" />
                            </LoadingButton>

                            <IconButton size="small" onClick={() => setEditMode(false)}>
                                <Remove fontSize="small" />
                            </IconButton>
                        </> :
                            <>
                                {(role.meta_editable || role.perms_editable) && <IconButton size="small" onClick={() => setEditMode(true)}>
                                    <Edit fontSize="small" />
                                </IconButton>}
                                
                                {role.deletable && <IconButton size="small" color="warning" onClick={deleteRole}>
                                    <Delete fontSize="small" color="warning" />
                                </IconButton>}

                            </>
                        }
                    </Stack>

                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}



export default function PermissionsTable({ acl, onChanges }) {

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Role name</TableCell>
                        <TableCell>Description</TableCell>
                        {permissions.map(perm => <TableCell align="center" key={perm.code}>{perm.label}</TableCell>)}
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {acl.roles.map((role) => (
                        <Row key={role.id} role={role} permissions={permissions} onChanges={onChanges} />
                    ))}
                </TableBody>
            </Table>

            <RoleCreate permissions={permissions} acl_id={acl.id} onCreate={onChanges} />
        </TableContainer>
    );
}