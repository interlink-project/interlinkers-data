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
import useMounted from 'hooks/useMounted';

const CoproductionprocessCreate = ({ getButton, teams = [], onCreate }) => {
  const [open, setOpen] = useState(false);
  const auth = useAuth();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logotype, setLogotype] = useState(null);
  const [teamId, setTeamId] = useState('');

  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const mounted = useMounted();

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
      setLoading(true)
      coproductionProcessesApi.create({
        name,
        description,
        team_id: teamId
      }).then(res => {
        if (!logotype) {
          sendOnCreate(res.data)
          setLoading(false)
        } else {
          coproductionProcessesApi.setFile(res.data.id, "logotype", logotype).then(res2 => {
            sendOnCreate(res2.data)
          }).catch(() => {
            sendOnCreate(res.data)
          }).finally(() => setLoading(false))
        }

      }).catch(err => { 
        console.log(err)
        setLoading(false) })
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
    // avoid seeing how data is cleared
    setTimeout(() => {
      if(mounted){
        setName("")
        setDescription("")
        setLogotype(null)
        setTeamId('')
        setActiveStep(0)
      }
    }, 1000);    
  };


  const handleChange = (event) => {
    setTeamId(event.target.value);
  };

  const team = teams.find(team => team.id === teamId)

  const isDisabled = () => {
    if (activeStep === 0 && (!name)){
      return true
    }
    if (activeStep === 1 && !teamId){
      return true
    }
  }
  return (
    <>
      {getButton(handleClickOpen)}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Co-production process creation</DialogTitle>
        <DialogContent>
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
          <Typography>
            Now you must select the main team of the process. Later you will be able to add additional users / teams to the process.
          </Typography>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
            >

              {team && <AvatarGroup max={4} sx={{m: 1, p:1}}>
              <Avatar src={team.logotype_link} />
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
              <LoadingButton loading={loading} size="small" onClick={handleNext} disabled={isDisabled()}>
                {activeStep === 1 ? "Create" : "Next"}
                <KeyboardArrowRight />
              </LoadingButton>
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
