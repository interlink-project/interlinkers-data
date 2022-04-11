import { Stack, Switch, Chip, Paper, Table, TableCell, TableContainer, TableHead, TableRow, TableBody, IconButton, TextField, Collapse, Box } from '@material-ui/core';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardArrowUp as KeyboardArrowUpIcon, KeyboardArrowDown as KeyboardArrowDownIcon, Check, Edit, Delete, Save, Remove, Close } from '@material-ui/icons';
import RoleCreate from './RoleCreate';
import { LoadingButton } from '@material-ui/lab';
import { rolesApi } from '__api__';
import i18n from 'translations/i18n';
import { useTranslation } from 'react-i18next';

const permissions = [
    {
        "code": "view_assets",
        "label": i18n.t("view-resources")
    },
    {
        "code": "create_assets",
        "label": i18n.t("create-resources")
    },
    {
        "code": "delete_assets",
        "label": i18n.t("delete-resources")
    },
    {
        "code": "change_access",
        "label": i18n.t("add-teams-or-individuals")
    },
    {
        "code": "update_settings",
        "label": i18n.t("change-settings")
    },
]

function Row(props) {
    const { role, onChanges } = props;
    const [editMode, setEditMode] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [newName, setNewName] = React.useState(role.name);
    const [newDescription, setNewDescription] = React.useState(role.description);
    const [newPermissions, setNewPermissions] = React.useState(role.permissions);
    const {t} = useTranslation()

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



export default function PermissionsTable({onChanges}) {
    const { process, roles } = useSelector((state) => state.process);
    const {t} = useTranslation()
    
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
                        <Row key={role.id} role={role} onChanges={onChanges} />
                    ))}
                </TableBody>
            </Table>

            <RoleCreate coproductionprocess_id={process.id} onCreate={onChanges} possiblePermissions={permissions} />
        </TableContainer>
    );
}