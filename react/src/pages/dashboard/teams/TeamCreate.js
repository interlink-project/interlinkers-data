import {
  Alert, Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Input,
  List,
  ListItem,
  ListItemAvatar, ListItemSecondaryAction, ListItemText, MobileStepper, TextField, useTheme
} from '@material-ui/core';
import { Cancel, CheckCircle, Delete, KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import useAuth from 'hooks/useAuth';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import { useEffect, useState } from 'react';
import { getLanguage } from 'translations/i18n';
import { teamsApi, usersApi } from '__api__';

const TeamCreate = ({ language = getLanguage(), loading, setLoading, open, setOpen, onCreate }) => {
  const [emailValue, setEmailValue] = useState("");
  const auth = useAuth();
  const [selectedUsers, setSelectedUsers] = useState([auth.user]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logotype, setLogotype] = useState(null);
  const t = useCustomTranslation(language)
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  const clean = () => {
    setName("")
    setDescription("")
    setLogotype(null)
    setSelectedUser(null)
    setSelectedUsers([auth.user])
    setActiveStep(0)
  }
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

  const handleClose = () => {
    setOpen(false);
    // avoid seeing how data is cleared
    setTimeout(() => {
      clean()
    }, 1000);
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

  const isDisabled = () => {
    if (activeStep === 0 && (!name || !description)) {
      return true
    }
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t("team-create-title")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("team-create-description")}
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
              label={t("Name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              margin="dense"
              id="description"
              label={t("Description")}
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
                name += ` (${t("you")})`
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
              label={t("Email address")}
              type="email"
              fullWidth
              variant="standard"
              value={emailValue}
              onChange={(e) => {
                setEmailValue(e.target.value)
              }}
            />
            {emailValue && !selectedUser && <Alert severity='warning'>{t("User must have logged in first")}</Alert>}
            <LoadingButton loading={loading} fullWidth variant="text" color='primary' onClick={() => {
              setSelectedUsers([...selectedUsers, selectedUser])
              setSelectedUser(null)
              setEmailValue("")

            }}
              disabled={!selectedUser}
              endIcon={selectedUser ? <CheckCircle /> : (emailValue && <Cancel color='error' />)}
              sx={{ mt: 1 }}
            >{t("Add user")}</LoadingButton>
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
              <Button size="small" onClick={handleNext} disabled={isDisabled()}>
                {activeStep === 1 ? t("Create") : t("Next")}
                <KeyboardArrowRight />
              </Button>
            }
            backButton={
              <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                <KeyboardArrowLeft />
                {t("Back")}
              </Button>
            }
          />

        </DialogActions>
      </Dialog>
    </>
  );
};

export default TeamCreate;
