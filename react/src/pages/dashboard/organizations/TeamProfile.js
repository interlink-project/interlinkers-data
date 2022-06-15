import { Alert, Avatar, Box, Button, CircularProgress, Dialog, DialogContent, Grid, IconButton, Input, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Skeleton, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@material-ui/core';
import { Delete, Edit, MoreVert, Remove, Save } from '@material-ui/icons';
import ConfirmationButton from 'components/ConfirmationButton';
import useAuth from 'hooks/useAuth';
import useDependantTranslation from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { teamsApi, usersApi } from '__api__';
import UserSearch from '../coproductionprocesses/Tabs/Team/UserSearch';


const MyMenuItem = ({ onClick, text, icon, id, loading = false }) => {
  return <MenuItem aria-describedby={id} onClick={onClick}>
    <ListItemIcon>
      {loading === id ? <CircularProgress /> : icon}
    </ListItemIcon>
    <ListItemText>{text}</ListItemText>
  </MenuItem>
}


const UserRow = ({ isAdmin, t, team, user, onChanges }) => {
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
            teamsApi.removeUser(team.id, user.id).then(() => {
              onChanges()
            })
          }} text={t("Remove {{what}}")} icon={<Delete />} />
        </Menu>
      </>}
    </TableCell>
  </TableRow>

}
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

  const isAdmin = team && team.user_participation && team.user_participation.includes('administrator')

  return (<Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
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
              {isAdmin && <>
                {!editMode ? <Button disabled={!isAdmin} startIcon={<Edit />} variant="contained" color="primary" onClick={() => setEditMode(true)}>{t("Edit")}</Button>
                : <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
                  <Button disabled={!somethingChanged} variant="text" color="warning" onClick={() => setEditMode(false)}>{t("Discard changes")}</Button>
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
          <Table sx={{ minWidth: 300 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>{t("Full name")}</TableCell>
                <TableCell>{t("Email")}</TableCell>
                <TableCell>{t("Last login")}</TableCell>
                <TableCell>{t("Actions")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {team.users.map((user) => (
                <UserRow isAdmin={isAdmin} key={user.id} t={t} team={team} user={user} onChanges={() => update()} />
              ))}
            </TableBody>
          </Table>
          {isAdmin && <Box sx={{ mx: 6, textAlign: "center", justifyContent: "center" }}>
            <UserSearch text={t("Add user to the team")} onClick={addUserToTeam} />
          </Box>}
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
