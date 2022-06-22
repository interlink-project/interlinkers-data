import { Alert, Avatar, Box, Button, Chip, CircularProgress, Grid, IconButton, Input, ListItemIcon, ListItemText, Menu, MenuItem, Skeleton, Stack, Tab, Table, TableBody, TableCell, TableHead, TableRow, Tabs, TextField, Typography } from '@material-ui/core';
import { Add, Check, Delete, Edit, MoreVert, People, Save } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import CentricCircularProgress from 'components/CentricCircularProgress';
import ConfirmationButton from 'components/ConfirmationButton';
import { OrganizationChip } from 'components/dashboard/assets/Icons';
import { user_id } from 'contexts/CookieContext';
import useAuth from 'hooks/useAuth';
import useDependantTranslation from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { getLanguage } from 'translations/i18n';
import { organizationsApi, usersApi } from '__api__';
import TeamCreate from './TeamCreate';
import TeamProfile from './TeamProfile';

const MyMenuItem = ({ onClick, text, icon, id, loading = false }) => {
    return <MenuItem aria-describedby={id} onClick={onClick}>
        <ListItemIcon>
            {loading === id ? <CircularProgress /> : icon}
        </ListItemIcon>
        <ListItemText>{text}</ListItemText>
    </MenuItem>
}

const UserRow = ({ isAdmin, t, organization, user, onChanges }) => {
    const { user: auth_user } = useAuth();
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(null)
    const mounted = useMounted();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (event) => {
        event.stopPropagation();
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };


    useEffect(() => {
        setLoading(true)
        usersApi.get(user.id).then(res => {
            if (mounted.current) {
                setData(res.data)
                setLoading(false)
            }
        })
    }, [user])

    const you = user.id === auth_user.sub

    return <TableRow
        key={user.id}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
        <TableCell component="th" scope="row">
            {data ? <Avatar src={data.picture} /> : <Skeleton />}
        </TableCell>
        <TableCell>{data ? data.full_name : <Skeleton />}{you && <> ({t("you")})</>}</TableCell>
        <TableCell>{data ? data.email : <Skeleton />}</TableCell>
        <TableCell>{data ? moment(data.last_login).fromNow() : <Skeleton />}</TableCell>
        <TableCell>
            {isAdmin && <>
                <IconButton aria-label="settings" id="basic-button"
                    aria-controls="basic-menu"
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                >
                    <MoreVert />
                </IconButton>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MyMenuItem key={`${user.id}-remove-action`} id="remove" onClick={() => {
                        organizationsApi.removeUser(organization.id, user.id).then(() => {
                            onChanges()
                        })
                    }} text={t("Remove {{what}}")} icon={<Delete />} />
                </Menu>
            </>}
        </TableCell>
    </TableRow>

}
const OrganizationProfile = ({ organizationId, onChanges }) => {
    const [editMode, setEditMode] = useState(false)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [logotype, setLogotype] = useState(null);
    const [loadingTeams, setLoadingTeams] = useState(true)
    const [organization, setOrganization] = useState({ teams_ids: [] })
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [teamCreatorOpen, setOpenTeamCreator] = useState(false);
    const [creatingTeam, setCreatingTeam] = useState(false);
    const [profileLanguage, setProfileLanguage] = useState(getLanguage())

    const mounted = useMounted();
    const { t } = useDependantTranslation()

    const getTeams = () => {
        setLoadingTeams(true)
        organizationsApi.getOrganizationTeams(organizationId).then(res => {
            setTeams(res)
            setLoadingTeams(false)
        })
    }

    const addAdminToOrganization = (user) => {
        organizationsApi.addUser(organizationId, user.sub || user.id).then(res => {
            if (mounted.current) {
                update(() => {
                    onChanges && onChanges()
                })
            }
        })
    }

    const nameAndDescChanged = (name !== organization.name) || (description !== organization.description)
    const somethingChanged = nameAndDescChanged || logotype !== null

    const handleSave = async () => {
        const calls = []

        let send = false
        if (nameAndDescChanged) {
            const data = {
                name_translations: {
                    ...organization.name_translations,
                    [profileLanguage]: name
                },
                description_translations: {
                    ...organization.description_translations,
                    [profileLanguage]: description
                },
            }
            console.log("UPDATE", data)
            calls.push(organizationsApi.update(organization.id, data))
            send = true
        }

        // change logotype if specified
        if (logotype) {
            calls.push(organizationsApi.setFile(organization.id, "logotype", logotype))
            send = true
        }

        if (send) {
            await Promise.all(calls);
            onChanges && onChanges()
            update(() => {
                setEditMode(false)
            })
        }

    }

    const handleRemove = () => {
        organizationsApi.delete(organizationId).then(() => {
            onChanges && onChanges()
        })
    }

    const update = (callback) => {
        organizationsApi.get(organizationId).then(res => {
            if (mounted.current) {
                setOrganization(res)
                setName(res.name)
                setDescription(res.description)
                getTeams()
                callback && callback(res)
            }
        })
    }

    useEffect(() => {
        update()
    }, [])

    const handleFileSelected = (e) => {
        const files = e.target.files
        if (files.length > 0) {
            const file = files[0]
            if (file) {
                file.path = URL.createObjectURL(file)
                setLogotype(file)
            }

        }
    }

    const organization_trans = t("organization")
    const canCreateTeams = organization.team_creation_permission === "anyone" || (organization.team_creation_permission === "administrators" && organization.administrators_ids.includes(user_id)) || (organization.team_creation_permission === "members" && !organization.public)
    const isAdmin = organization && organization.user_participation && organization.user_participation.includes('administrator')

    const [tabValue, setTabValue] = useState('teams');
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (<Box>
        {organization ? <Grid container>
            <Grid item md={4}>
                <Stack direction="column" sx={{ textAlign: "center", justifyContent: "center", p: 2 }} spacing={2}>
                    {editMode ? <label htmlFor="contained-button-file">
                        <Input inputProps={{ accept: 'image/*' }} id="contained-button-file" type="file" sx={{ display: "none" }} onChange={handleFileSelected} />
                        <IconButton component="span" color="inherit">
                            <div style={{
                                width: "100px",
                                height: "100px",
                                position: "relative"
                            }}>
                                <Avatar
                                    src={logotype ? logotype.path : organization.logotype_link}
                                    variant="rounded"
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        position: "absolute"
                                    }}
                                />
                                <Edit style={{
                                    width: "50%",
                                    height: "50%",
                                    position: "absolute",
                                    top: "50%",
                                    transform: "translateY(-50%)"
                                }} />
                            </div>


                        </IconButton>
                    </label> : <IconButton component="span" color="inherit" disabled>
                        <Avatar
                            src={logotype ? logotype.path : organization.logotype_link}
                            variant="rounded"
                            style={{
                                width: "100px",
                                height: "100px",
                            }}
                        />
                    </IconButton>}
                    {!editMode ? <Typography variant="h5">{organization.name}</Typography> : <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        fullWidth
                        variant="standard"
                    />}
                    {!editMode ? <Typography variant="body1">{organization.description}</Typography> : <TextField
                        margin="dense"
                        id="description"
                        label="Description"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                        variant="standard"
                    />}
                    {isAdmin && <>
                        {!editMode ? <Button disabled={!isAdmin} startIcon={<Edit />} variant="contained" color="primary" onClick={() => setEditMode(true)}>{t("Edit")}</Button>
                            : <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
                                <Button variant="text" color="warning" onClick={() => setEditMode(false)}>{t("Discard changes")}</Button>
                                <Button disabled={!somethingChanged} startIcon={<Save />} variant="contained" color="success" onClick={handleSave}>{t("Save")}</Button>
                            </Stack>
                        }
                        <ConfirmationButton
                            Actionator={({ onClick }) => <Button startIcon={<Delete />} disabled={!editMode} variant="text" color="error" onClick={onClick}>{t("Remove {{what}}", { what: organization_trans })}</Button>}
                            ButtonComponent={({ onClick }) => <Button sx={{ mt: 1 }} fullWidth variant='contained' color="error" onClick={onClick}>{t("Confirm deletion")}</Button>}
                            onClick={handleRemove}
                            text={t("Are you sure?")}
                        />
                    </>}
                </Stack>
            </Grid>
            <Grid item md={8} sx={{ p: 2 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="organization-right-side-tabs"
                    sx={{ mb: 2 }}
                    centered
                >
                    <Tab value="teams" label={t("Teams")} />

                    <Tab value="administrators" label={t("Administrators")} />
                </Tabs>
                <TeamCreate
                    open={teamCreatorOpen}
                    setOpen={setOpenTeamCreator}
                    onCreate={getTeams}
                    loading={creatingTeam}
                    setLoading={setCreatingTeam}
                    organization={organization}
                />
                {selectedTeam && <TeamProfile teamId={selectedTeam.id} open={selectedTeam ? true : false} setOpen={setSelectedTeam} onChanges={getTeams} />}

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">{t("Name")}</TableCell>
                            <TableCell align="center">{t("Type")}</TableCell>
                            <TableCell align="center">{t("Created")}</TableCell>
                            <TableCell align="center">{t("Members")}</TableCell>
                            <TableCell align="center">{t("Your participation in the team")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {teams && teams.map((team) => (
                            <TableRow sx={{ cursor: 'pointer' }} key={team.id} onClick={() => setSelectedTeam(team)} hover>
                                <TableCell align="center">
                                    <Stack alignItems="center" direction="row" spacing={1}>
                                        {team.logotype_link ? <Avatar sx={{ height: "25px", width: "25px" }} variant="rounded" src={team.logotype_link} /> : <People />}
                                        <b>{team.name}</b>
                                    </Stack>
                                </TableCell>
                                <TableCell align="center" component="th" scope="row">
                                    <OrganizationChip type={team.type} />
                                </TableCell>
                                <TableCell align="center">{moment(team.created_at).fromNow()}</TableCell>
                                <TableCell align="center">
                                    {team.users_count}
                                </TableCell>
                                <TableCell align="center">
                                    {team.user_participation.length > 0 ? team.user_participation.map(p => <Chip size="small" sx={{ mr: 1 }} key={team.id + p} title={`You are ${p} of the organization`} variant={p === "administrator" ? "contained" : "outlined"} label={p} />) : <Chip label={t("None")} />}
                                </TableCell>
                            </TableRow>
                        ))}
                        {loadingTeams && [...Array(organization.teams_ids.length).keys()].map((i) => <TableRow key={`skeleton-${i}`}>
                            <TableCell align="center" colSpan={6}>
                                <Skeleton />
                            </TableCell>
                        </TableRow>
                        )}
                    </TableBody>
                </Table>

                {(!loadingTeams && (!teams || teams.length) === 0) && <Alert severity="warning">
                    {t("No teams found in this organization")}
                </Alert>}
                <Box sx={{ textAlign: "center" }}>
                    <LoadingButton loading={loadingTeams || creatingTeam} sx={{ mt: 3 }} size="small" variant="contained" startIcon={<Add />} onClick={() => setOpenTeamCreator(true)} disabled={!canCreateTeams}>{t("Create new team")}</LoadingButton>
                </Box>
            </Grid>
        </Grid> : <CentricCircularProgress />
        }
    </Box >
    );
};

export default OrganizationProfile;
