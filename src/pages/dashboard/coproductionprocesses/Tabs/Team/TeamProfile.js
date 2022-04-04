import { Avatar, Box, CircularProgress, Dialog, DialogContent, Grid, IconButton, Input, Paper, Skeleton, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@material-ui/core';
import { Edit, Save } from '@material-ui/icons';
import useMounted from 'hooks/useMounted';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { teamsApi, usersApi } from '__api__';
import UserSearch from './UserSearch';

const UserRow = ({ user, editMode }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(null)
  const mounted = useMounted();

  useEffect(() => {
    setLoading(true)
    usersApi.get(user.id).then(res => {
      if (mounted) {
        setData(res.data)
        setLoading(false)
      }
    })
  }, [user])

  return <TableRow
    key={user.id}
    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
  >
    <TableCell component="th" scope="row">
      {data ? <Avatar src={data.picture} /> : <Skeleton />}
    </TableCell>
    <TableCell>{data ? data.full_name : <Skeleton />}</TableCell>
    <TableCell>{data ? data.email : <Skeleton />}</TableCell>
    <TableCell>{data ? moment(data.last_login).fromNow() : <Skeleton />}</TableCell>
    {editMode && <TableCell></TableCell>}
  </TableRow>

}
const TeamProfile = ({ open, setOpen, teamId, onChanges }) => {
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState("")
  const [team, setTeam] = useState(null)
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const [logotype, setLogotype] = useState(null);

  const mounted = useMounted();

  const handleClose = () => {
    setOpen(false);
  };

  const addUserToTeam = (user) => {
    teamsApi.addUser(teamId, user.sub || user.id).then(res => {
      if (mounted) {
        update(res)
        onChanges && onChanges(res)
      }
    })
  }

  const handleSave = async () => {
    const calls = []
   
    let send = false
    if ((name !== team.name) || (description !== team.description)) {
      const data = {name, description}
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
      const callResponses = await Promise.all(calls);
      if (mounted) {
        onChanges && onChanges()
        update(callResponses.find(el => el !== null && Object.keys(el).length > 0))
      }
      setLoading(false)
    }
    
  }

  const update = (data) => {
    setTeam(data)
    setName(data.name)
    setLogotype(null)
    setDescription(data.description)
  }

  useEffect(() => {
    setEditMode(false)
    if (teamId) {
      setLoading(true)
      teamsApi.get(teamId).then(res => {
        if(mounted){
          update(res)
          setLoading(false)
        }
      })
    }
  }, [open, setOpen, onChanges])

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

  return (<Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
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

              {!editMode ? <IconButton onClick={() => setEditMode(true)}>
                <Edit />
              </IconButton> : <IconButton onClick={() => setEditMode(false)}>
                <Save onClick={handleSave} />
              </IconButton>}
            </Stack>

          </Paper>

        </Grid>
        < Grid item md={8} sx={{ p: 2 }}>
          <Table sx={{ minWidth: 300 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Full name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Last login</TableCell>
                {editMode && <TableCell>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {team.users.map((user) => (
                <UserRow editMode={editMode} user={user} />
              ))}
            </TableBody>
          </Table>
          {editMode && <Box sx={{ mx: 6, textAlign: "center", justifyContent: "center" }}>
            <UserSearch text="Add user to the team" onClick={addUserToTeam} />
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
