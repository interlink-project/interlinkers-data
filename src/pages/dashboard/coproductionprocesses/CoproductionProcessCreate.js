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
  Divider,
  ListItem,
  ListItemAvatar,
  IconButton,
  ListItemText,
  Avatar,
  ListItemSecondaryAction,
  Typography,
  useTheme,
  MobileStepper,
  AvatarGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';
import { Add, Delete, Folder, KeyboardArrowRight, KeyboardArrowLeft, CheckCircle, Cancel } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import useAuth from 'hooks/useAuth';
import { coproductionProcessesApi, usersApi } from '__fakeApi__';
import { getImageUrl } from 'axiosInstance';
import TeamCreate from '../teams/TeamCreate';

const CoproductionprocessCreate = ({ teams = [], onCreate }) => {
  const [open, setOpen] = useState(false);
  const auth = useAuth();

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
      coproductionProcessesApi.create({
        name,
        description,
        team_id: teamId
      }).then(res => {
        if (!logotype) {
          sendOnCreate(res.data)
        } else {
          coproductionProcessesApi.setFile(res.data.id, "logotype", logotype).then(res2 => {
            sendOnCreate(res2.data)
          }).catch(() => {
            sendOnCreate(res.data)
          })
        }

      }).catch(err => console.log(err))
    }
  };

  const handleBack = () => {
    setTeamId('')
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

  const [teamId, setTeamId] = useState('');

  const handleChange = (event) => {
    setTeamId(event.target.value);
  };

  const team = teams.find(team => team.id === teamId)

  return (
    <>
      <Button fullWidth variant="contained" color='primary' onClick={handleClickOpen}>
        Create new coproductionprocess
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Coproductionprocess creation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a coproductionprocess, please enter a name and a description. Then, add a team to the coproductionprocess.
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

          {activeStep === 1 && <>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
            >

              {team && <AvatarGroup max={6}>
                <Avatar src={getImageUrl("coproduction", team.logotype)} />
                {team && team.memberships.map(member => <Avatar key={member.id} src={member.picture} />)}

              </AvatarGroup>}
            </Box>

            <FormControl variant="standard" sx={{ m: 1, width: "100%" }}>
              <InputLabel id="demo-simple-select-standard-label">Team</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={teamId}
                onChange={handleChange}
                label="Team"
                fullWidth
              >
                {teams.map(team => <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>)}

              </Select>
            </FormControl>

            {!teamId && <><Divider flexItem sx={{ m: 3 }}>
              Or create a new team...
            </Divider><TeamCreate /></>}
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
              <Button size="small" onClick={handleNext} disabled={activeStep === 1 && !teamId}>
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

export default CoproductionprocessCreate;
