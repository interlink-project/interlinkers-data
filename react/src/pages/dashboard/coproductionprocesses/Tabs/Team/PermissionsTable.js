import { Chip, IconButton, Paper, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@material-ui/core';
import { Check, Close, Delete, Edit, Remove, Save } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import useDependantTranslation from 'hooks/useDependantTranslation';
import * as React from 'react';
import { useSelector } from 'react-redux';
import i18n from 'translations/i18n';
import { rolesApi } from '__api__';
import RoleCreate from './RoleCreate';

function Row(props) {
    const { role, onChanges, permissions } = props;
    const [editMode, setEditMode] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [newName, setNewName] = React.useState(role.name);
    const [newDescription, setNewDescription] = React.useState(role.description);
    const [newPermissions, setNewPermissions] = React.useState(role.permissions);
    const { t } = useDependantTranslation()

    const PermittedChip = () => <Chip
        color="success"
        size="small"
        icon={<Check />}
    />
    const NotPermittedChip = () => <Chip
        size="small"
        icon={<Close />}
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
                        label={t("Name")}
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        variant="standard"
                        fullWidth
                    /> : role.name}
                </TableCell>
                <TableCell>
                    {editMode && role.meta_editable ? <TextField
                        required
                        label={t("Description")}
                        defaultValue={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        variant="standard"
                        multiline
                        fullWidth
                    /> : role.description}
                </TableCell>
                {permissions.map(perm => {
                    const active = role.permissions.findIndex(pr => pr === perm.code) >= 0
                    return <TableCell key={perm.code + role.id} align="center">
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



export default function PermissionsTable({ onChanges }) {
    const { process, roles } = useSelector((state) => state.process);
    const { t } = useDependantTranslation()

    const permissions = [
        {
            "code": "view_assets",
            "label": t("view-resources")
        },
        {
            "code": "create_assets",
            "label": t("create-resources")
        },
        {
            "code": "delete_assets",
            "label": t("delete-resources")
        },
        {
            "code": "change_access",
            "label": t("add-teams-or-individuals")
        },
        {
            "code": "update_settings",
            "label": t("change-settings")
        },
    ]

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>{t("Name")}</TableCell>
                        <TableCell>{t("Description")}</TableCell>
                        {permissions.map(perm => <TableCell align="center" key={perm.code}>{perm.label}</TableCell>)}
                        <TableCell>{t("Actions")}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {roles.map((role) => (
                        <Row key={role.id} role={role} onChanges={onChanges} permissions={permissions} />
                    ))}
                </TableBody>
            </Table>

            <RoleCreate coproductionprocess_id={process.id} onCreate={onChanges} possiblePermissions={permissions} />
        </TableContainer>
    );
}