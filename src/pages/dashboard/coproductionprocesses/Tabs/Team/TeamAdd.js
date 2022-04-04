import {
  Alert, Avatar, Button, Dialog, DialogContent, Divider, FormControl, Input, MenuItem, Select, Typography
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import useMounted from 'hooks/useMounted';
import TeamCreate from 'pages/dashboard/teams/TeamCreate';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTeam } from 'slices/general';
import { coproductionProcessesApi, teamsApi } from '__api__';

const TeamAdd = ({ open, setOpen, currentTeams, onChanges }) => {
  const mounted = useMounted();
  const [selectedTeam, setSelectedTeam] = useState(null);
  const { process } = useSelector((state) => state.process);
  const { teams } = useSelector((state) => state.general);
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

  useEffect(() => {
    if (open) {
      setSelectedTeam(null)
    }
  }, [open]);

  const handleClose = () => {
    setOpen(false);
  };


  const handleAdd = () => {
    coproductionProcessesApi.addTeam(process.id, selectedTeam.id).then((res) => {
      handleClose()
      onChanges && onChanges(res)
    })
  }

  const selectableTeams = teams.filter((team) => currentTeams.findIndex(t => t.id === team.id))

  console.log(teams, currentTeams, selectableTeams)
  return (
    <>
      <TeamCreate
        open={teamCreatorOpen}
        setOpen={setOpenTeamCreator}
        onCreate={onTeamCreate}
        loading={creatingTeam}
        setLoading={setCreatingTeam}
      />
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogContent sx={{ m: 2 }}>
          {!selectedTeam ? <>
            {selectableTeams.length > 0 ? <FormControl sx={{ m: 1, width: 300 }}>
              <Select
                onChange={handleChange}
                input={<Input label="Team name" />}
                fullWidth
                renderValue={(selected) => teams.find(team => team.id === selected).name}
              >
                {selectableTeams.map( team => <MenuItem key={team.id} value={team.id}>
                    <Avatar src={team.logotype_link} sx={{ mr: 2, width: "30px", height: "30px" }} />
                    {team.name}
                  </MenuItem>
                )}
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
            <Typography variant="h6" sx={{ textAlign: "center", my: 2 }}>Are you sure you want to add "{selectedTeam.name}" to this process? It will be added with the default role</Typography>
            <Button color="warning" fullWidth onClick={handleAdd}>Add</Button>
          </>}
        </DialogContent>

      </Dialog>
    </>
  );
};

export default TeamAdd;
