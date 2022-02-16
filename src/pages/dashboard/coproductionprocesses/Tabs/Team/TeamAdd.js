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
  Alert

} from '@material-ui/core';
import { coproductionProcessesApi, teamsApi } from '__fakeApi__';
import useMounted from 'hooks/useMounted';
import { styled } from '@material-ui/styles';
import { useSelector } from 'react-redux';

const TeamAdd = ({ currentTeams, onChanges }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const mounted = useMounted();
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const { process } = useSelector((state) => state.process);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedTeamId(value);
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

    }
  }, [open, getTeamsData]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const handleAdd = () => {
    coproductionProcessesApi.addTeam(process.id, selectedTeamId).then((res) => onChanges(res))
  }

  return (
    <>
      <Button fullWidth variant="contained" color='primary' onClick={handleClickOpen}>
        Add new team
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add team</DialogTitle>
        <DialogContent>

          {teams.length > 1 ? <FormControl sx={{ m: 1, width: 300 }}>
            <Select
              value={selectedTeamId}
              onChange={handleChange}
              input={<Input label="Team name" />}
              renderValue={(selected) => teams.find(team => team.id === selected).name}
            >
              {teams.map((team) => currentTeams.findIndex(t => t.id === team.id) < 0 && (
                <MenuItem key={team.id} value={team.id}>
                  <Avatar src={team.logotype} sx={{ mr: 2, width: "30px", height: "30px" }} />
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl> : <Alert severity="warning">There are no more teams!</Alert>
          }
        </DialogContent>
        <DialogActions>

          <Button fullWidth onClick={handleAdd} disabled={!selectedTeamId}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TeamAdd;
