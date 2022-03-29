import {
  Avatar, AvatarGroup, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, IconButton, Input, InputLabel, MenuItem, MobileStepper, Select, TextField, Typography,
  useTheme, CircularProgress
} from '@material-ui/core';
import { Add, KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import useAuth from 'hooks/useAuth';
import useMounted from 'hooks/useMounted';
import { useState, useEffect } from 'react';
import { coproductionProcessesApi } from '__fakeApi__';
import TeamCreate from '../teams/TeamCreate';
import { useDispatch, useSelector } from 'react-redux';
import { addTeam } from 'slices/general';
import { usersApi } from "__fakeApi__"

const UserData = ({ variant, id }) => {
  const mounted = useMounted();
  const [data, setData] = useState(null)
  useEffect(() => {
    usersApi.get(id).then(res => {
      if (mounted) {
        setData(res.data)
      }
    })
  }, [id])
  return data ? <Avatar key={id} src={data.picture} /> : <CircularProgress key={id} />
}
const CoproductionprocessCreate = ({ open, setOpen, loading, setLoading, onCreate }) => {
  const dispatch = useDispatch();
  const { teams } = useSelector((state) => state.general);

  const auth = useAuth();
  const [creatingTeam, setCreatingTeam] = useState(false);
  const [teamCreatorOpen, setOpenTeamCreator] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logotype, setLogotype] = useState(null);
  const [team, setTeam] = useState(null);

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
      if (!team || !team.id) {
        return
      }
      setLoading(true)
      coproductionProcessesApi.create({
        name,
        description,
        team_id: team.id
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
        setLoading(false)
      })
    }
  };

  const handleBack = () => {
    setTeam(null)
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
      if (mounted) {
        setName("")
        setDescription("")
        setLogotype(null)
        setTeam(null)
        setActiveStep(0)
      }
    }, 1000);
  };


  const handleChange = (event) => {
    setTeam(teams.find(team => team.id === event.target.value));
  };

  const isDisabled = () => {
    if (activeStep === 0 && (!name)) {
      return true
    }
    if (activeStep === 1 && (!team || !team.id)) {
      return true
    }
  }

  const onTeamCreate = (res2) => {
    dispatch(addTeam({
      data: res2,
      callback: () => setTeam(res2)
    }))
  }

  return (
    <>
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

              {team && <AvatarGroup max={4} sx={{ m: 1, p: 1 }}>
                <Avatar src={team.logotype_link} />
                {team && team.users.map(user => <UserData variant="avatar" id={user.id} />)}

              </AvatarGroup>}
            </Box>

            <FormControl variant="standard" sx={{ m: 1, width: "100%" }}>
              <InputLabel id="demo-simple-select-standard-label">Team</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={team && team.id}
                onChange={handleChange}
                label="Team"
                fullWidth
              >
                {teams.map(team => <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>)}

              </Select>
              <Divider sx={{ mt: 3, mb: 2 }}>Or create a new one</Divider>
              <LoadingButton onClick={() => setOpenTeamCreator(true)} loading={creatingTeam} fullWidth variant="outlined" sx={{ textAlign: "center", mt: 1 }} color="success" startIcon={<Add />} size="small">
                Create new team
              </LoadingButton>
              <TeamCreate
                open={teamCreatorOpen}
                setOpen={setOpenTeamCreator}
                onCreate={onTeamCreate}
                loading={creatingTeam}
                setLoading={setCreatingTeam}
              />
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
