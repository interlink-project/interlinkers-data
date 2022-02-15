import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Dialog,
  TextField,
  Button,
  Input,
  List,
  ListItem,
  ListItemAvatar,
  IconButton,
  ListItemText,
  Avatar,
  ListItemSecondaryAction,
  Typography,
  useTheme,
  MobileStepper,
  AvatarGroup
} from '@material-ui/core';
import { Add, Delete, Folder, KeyboardArrowRight, KeyboardArrowLeft, CheckCircle, Cancel } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import useAuth from 'hooks/useAuth';
import { teamsApi, usersApi } from '__fakeApi__';

const TeamCreate = ({ onCreate }) => {
  const [open, setOpen] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const auth = useAuth();
  const [selectedUsers, setSelectedUsers] = useState([auth.user]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logotype, setLogotype] = useState(null);

  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = async () => {

    const sendOnCreate = (data) => {
      if (onCreate) {
        onCreate(data)
      }
      handleClose()
    }

    if (activeStep < 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      teamsApi.create({
        name,
        description,
        user_ids: selectedUsers.map(user => user.sub)
      }).then(res => {
        if (!logotype) {
          sendOnCreate(res.data)
        } else {
          teamsApi.setFile(res.data.id, "logotype", logotype).then(res2 => {
            sendOnCreate(res2.data)
          }).catch(() => {
            sendOnCreate(res.data)
          })
        }

      }).catch(err => console.log(err))
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {

    var delayDebounceFn
    if (emailValue) {
      setLoading(true)
      delayDebounceFn = setTimeout(() => {
        usersApi.get(emailValue).then(res => {
          if (!selectedUsers.find(user => user.sub === res.data.sub)) {

            setSelectedUser(res.data)
          }
        }).catch(() => {
          setSelectedUser(null)
        }).finally(() => {
          setLoading(false)
        })
      }, 1000)
    }
    return () => clearTimeout(delayDebounceFn)
  }, [emailValue])

  const deleteUserFromList = (sub) => {
    setSelectedUsers(selectedUsers.filter(user => user.sub !== sub))
  }


  return (
    <>
      <Button fullWidth variant="contained" color='primary' onClick={handleClickOpen}>
        Create new team
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Team creation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a team, please enter a name and a description. Then, add people to the team.
          </DialogContentText>
          {activeStep === 0 && <><Box sx={{ textAlign: "center" }}>
            <label htmlFor="contained-button-file">
              <Input inputProps={{ accept: 'image/*' }} id="contained-button-file" type="file" sx={{ display: "none" }} onChange={handleFileSelected} />
              <IconButton component="span" >
                <Avatar
                  src={logotype && logotype.path}
                  style={{
                    margin: "10px",
                    width: "60px",
                    height: "60px",
                  }}
                />
              </IconButton>
            </label>
          </Box><TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
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
            />
          </>}

          {activeStep === 1 && <><List dense>
            {selectedUsers.map(user => {

              var name = user.full_name
              const you = user.sub === auth.user.sub
              if (you) {
                name += " (you)"
              }
              return <ListItem key={user.sub}
              >
                <ListItemAvatar>
                  <Avatar src={user.picture} />
                </ListItemAvatar>
                <ListItemText
                  primary={name}
                  secondary={user.email}
                />
                <ListItemSecondaryAction>
                  {!you && <IconButton edge="end" aria-label="delete" onClick={() => deleteUserFromList(user.sub)}>
                    <Delete />
                  </IconButton>}

                </ListItemSecondaryAction>
              </ListItem>
            })}

          </List>

            <TextField
              margin="dense"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
              value={emailValue}
              onChange={(e) => {
                setEmailValue(e.target.value)
              }}
            />

            <LoadingButton loading={loading} fullWidth variant="text" color='primary' onClick={() => {
              setSelectedUsers([...selectedUsers, selectedUser])
              setSelectedUser(null)
              setEmailValue("")

            }}
              disabled={!selectedUser}
              endIcon={selectedUser ? <CheckCircle /> : emailValue && <Cancel color='error' />}
              sx={{ mt: 1 }}
            >Add user</LoadingButton>
          </>}


        </DialogContent>
        <DialogActions>
          <MobileStepper
            variant="dots"
            steps={2}
            position="static"
            activeStep={activeStep}
            sx={{ flexGrow: 1 }}
            nextButton={
              <Button size="small" onClick={handleNext}>
                {activeStep === 1 ? "Create" : "Next"}
                <KeyboardArrowRight />
              </Button>
            }
            backButton={
              <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                <KeyboardArrowLeft />
                Back
              </Button>
            }
          />

        </DialogActions>
      </Dialog>
    </>
  );
};

export default TeamCreate;
