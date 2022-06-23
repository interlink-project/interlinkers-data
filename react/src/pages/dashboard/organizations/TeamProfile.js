import { Avatar, Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, Grid, IconButton, Input, Paper, Stack, Tab, Tabs, TextField, Typography } from '@material-ui/core';
import { Close, Delete, Edit, Save } from '@material-ui/icons';
import ConfirmationButton from 'components/ConfirmationButton';
import { OrganizationChip } from 'components/dashboard/assets/Icons';
import useDependantTranslation from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import { useEffect, useState } from 'react';
import { teamsApi } from '__api__';
import UsersList from './UsersList';

const TeamProfile = ({ open, setOpen, teamId, onChanges }) => {
  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [logotype, setLogotype] = useState(null);
  const [loading, setLoading] = useState(true)
  const [team, setTeam] = useState({})

  const mounted = useMounted();
  const { t } = useDependantTranslation()

  const handleClose = () => {
    setOpen(false);
  };

  const addUserToTeam = (user) => {
    teamsApi.addUser(teamId, user.sub || user.id).then(res => {
      if (mounted.current) {
        update(() => {
          onChanges && onChanges()
        })
      }
    })
  }

  const removeUserFromTeam = (user) => {
    teamsApi.removeUser(teamId, user.id).then(() => {
      if (mounted.current) {
        update(() => {
          onChanges && onChanges()
        })
      }
    })
  }


  const handleAdministratorAdd = (user) => {
    teamsApi.addAdministrator(teamId, user.id).then(res => {
      if (mounted.current) {
        update(() => {
          onChanges && onChanges()
        })
      }
    })
  }
  const handleAdministratorRemove = (user) => {
    teamsApi.removeAdministrator(teamId, user.id).then(res => {
      if (mounted.current) {
        update(() => {
          onChanges && onChanges()
        })
      }
    })
  }

  const nameAndDescChanged = (name !== team.name) || (description !== team.description)
  const somethingChanged = nameAndDescChanged || logotype !== null

  const handleSave = async () => {
    const calls = []

    let send = false
    if (nameAndDescChanged) {
      const data = { name, description }
      calls.push(teamsApi.update(team.id, data))
      send = true
    }

    // change logotype if specified
    if (logotype) {
      calls.push(teamsApi.setFile(team.id, "logotype", logotype))
      send = true
    }

    if (send) {
      setLoading(true)
      await Promise.all(calls);
      onChanges && onChanges()
      update(() => {
        setLoading(false)
        setEditMode(false)
      })
    }

  }

  const handleRemove = () => {
    teamsApi.delete(teamId).then(() => {
      onChanges && onChanges()
      setOpen(false)
    })
  }

  const update = (callback) => {
    teamsApi.get(teamId).then(res => {
      if (mounted.current) {
        setTeam(res)
        setName(res.name)
        setDescription(res.description)
        setLoading(false)
        callback && callback(res)
      }
    })
  }

  useEffect(() => {
    if (open) {
      // If dialog open, get team from api
      update()
    } else {
      // if dialog closed, set empty data and loading
      setEditMode(false)
      setTeam({})
      setLoading(true)
    }
  }, [open, editMode])

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

  const team_trans = t("team")

  const isAdmin = team && team.current_user_participation && team.current_user_participation.includes('administrator')

  const [tabValue, setTabValue] = useState('members');
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (<Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
    <DialogTitle sx={{ m: 0, p: 2, backgroundColor: "background.default" }}>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <Close />
      </IconButton>
    </DialogTitle>
    <DialogContent sx={{ minHeight: "60vh", backgroundColor: "background.default" }}>

      {(team && !loading) ? <Grid container>
        <Grid item md={4}>
          <Paper sx={{ height: "55vh", backgroundColor: "background.paper" }}>
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
                      src={logotype ? logotype.path : team.logotype_link}
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
                  src={logotype ? logotype.path : team.logotype_link}
                  variant="rounded"
                  style={{
                    width: "100px",
                    height: "100px",
                  }}
                />
              </IconButton>}
              {!editMode ? <Typography variant="h5">{team.name}</Typography> : <TextField
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
              {!editMode ? <Typography variant="body1">{team.description}</Typography> : <TextField
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
              <OrganizationChip type={team.type} />
              {isAdmin && <>
                {!editMode ? <Button disabled={!isAdmin} startIcon={<Edit />} variant="contained" color="primary" onClick={() => setEditMode(true)}>{t("Edit")}</Button>
                  : <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
                    <Button variant="text" color="warning" onClick={() => setEditMode(false)}>{t("Discard changes")}</Button>
                    <Button disabled={!somethingChanged} startIcon={<Save />} variant="contained" color="success" onClick={handleSave}>{t("Save")}</Button>
                  </Stack>
                }
                <ConfirmationButton
                  Actionator={({ onClick }) => <Button startIcon={<Delete />} disabled={!editMode} variant="text" color="error" onClick={onClick}>{t("Remove {{what}}", { what: team_trans })}</Button>}
                  ButtonComponent={({ onClick }) => <Button sx={{ mt: 1 }} fullWidth variant='contained' color="error" onClick={onClick}>{t("Confirm deletion")}</Button>}
                  onClick={handleRemove}
                  text={t("Are you sure?")}
                />
              </>}
            </Stack>
          </Paper>
        </Grid>
        < Grid item md={8} sx={{ p: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="organization-right-side-tabs"
            sx={{ mb: 2 }}
            centered
          >
            <Tab value="members" label={t("Members") + ` (${team.users.length})`} />
            <Tab value="administrators" label={t("Administrators") + ` (${team.administrators_ids.length})`} />
          </Tabs>
          {tabValue === "members" && <UsersList users={team.users} searchOnOrganization={isAdmin && team.organization_id} disableHeader={false} onSearchResultClick={addUserToTeam} getActions={(user) => isAdmin && (
            [
              {
                id: `${user.id}-remove-action`,
                onClick: removeUserFromTeam,
                text: t("Remove {{what}}"),
                icon: <Delete />
              }
            ]
          )} />}

          {tabValue === "administrators" && <UsersList users={team.administrators} searchOnOrganization={isAdmin && team.organization_id} disableHeader={false} onSearchResultClick={handleAdministratorAdd} getActions={(user) => isAdmin && (
            [
              {
                id: `${user.id}-remove-admin-action`,
                onClick: handleAdministratorRemove,
                text: t("Remove {{what}}"),
                icon: <Delete />,
                disabled: team.administrators_ids.length === 1
              }
            ]
          )} />}



        </Grid>
      </Grid> : <Box
        style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <Box >
          <CircularProgress />
        </Box>
      </Box>}
    </DialogContent>
  </Dialog>
  );
};

export default TeamProfile;
