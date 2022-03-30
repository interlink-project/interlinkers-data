import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Dialog,
  TextField,
  Button,
  Autocomplete,
  InputLabel,
  Select,
  OutlinedInput,
  useTheme,
  MenuItem,
  FormControl,
  Avatar,
  Input,
  Alert,
  Divider,
  Typography

} from '@material-ui/core';
import { coproductionProcessesApi, teamsApi } from '__fakeApi__';
import useMounted from 'hooks/useMounted';
import { styled } from '@material-ui/styles';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@material-ui/lab';
import TeamCreate from 'pages/dashboard/teams/TeamCreate';
import { addTeam } from 'slices/general';
import { Add } from '@material-ui/icons';

const TeamAdd = ({ currentTeams, onChanges }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const mounted = useMounted();
  const [selectedTeam, setSelectedTeam] = useState(null);
  const { process } = useSelector((state) => state.process);
  const [teamCreatorOpen, setOpenTeamCreator] = useState(false);
  const [creatingTeam, setCreatingTeam] = useState(false);
  const dispatch = useDispatch();

  const onTeamCreate = (res2) => {
    dispatch(addTeam({
      data: res2,
      callback: () => setSelectedTeam(res2)
    }))
  }

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedTeam(teams.find(t => t.id === value));
  };

  const getTeamsData = useCallback(async () => {
    try {
      setLoading(true)
      const teams_data = await teamsApi.getMine();
      if (mounted.current) {
        setTeams(teams_data);
        setLoading(false)
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);


  useEffect(() => {
    if (open) {
      getTeamsData();
      setSelectedTeam(null)
    }
  }, [open, getTeamsData]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const handleAdd = () => {
    coproductionProcessesApi.addTeam(process.id, selectedTeam.id).then((res) => onChanges && onChanges(res))
  }

  return (
    <>
      <TeamCreate
        open={teamCreatorOpen}
        setOpen={setOpenTeamCreator}
        onCreate={onTeamCreate}
        loading={creatingTeam}
        setLoading={setCreatingTeam}
      />
      <Button fullWidth variant="text" sx={{ m: 2 }} color='primary' onClick={handleClickOpen}>
        Add new team
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogContent sx={{ m: 2 }}>
          {!selectedTeam ? <>
            {teams.length > 1 ? <FormControl sx={{ m: 1, width: 300 }}>
              <Select
                value={selectedTeam && selectedTeam.id}
                onChange={handleChange}
                input={<Input label="Team name" />}
                fullWidth
                renderValue={(selected) => teams.find(team => team.id === selected).name}
              >
                {teams.map((team) => currentTeams.findIndex(t => t.id === team.id) < 0 && (
                  <MenuItem key={team.id} value={team.id}>
                    <Avatar src={team.logotype_link} sx={{ mr: 2, width: "30px", height: "30px" }} />
                    {team.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> : <Alert severity="warning">There are no more teams!</Alert>
            }

            <Divider sx={{ my: 2 }}>
              or
            </Divider>
            <LoadingButton onClick={() => setOpenTeamCreator(true)} loading={creatingTeam} fullWidth variant="outlined" color="success" startIcon={<Add />} size="small">
              Create new team
            </LoadingButton>

          </> : <>
          <Typography variant="h6" sx={{textAlign: "center", my: 2}}>Are you sure you want to add "{selectedTeam.name}" to this process? It will be added with the default role</Typography>
            <Button color="warning" fullWidth onClick={handleAdd}>Add</Button>
          </>}


        </DialogContent>

      </Dialog>
    </>
  );
};

export default TeamAdd;
