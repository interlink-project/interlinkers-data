import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Stack, Switch, Typography } from '@material-ui/core';
import { KeyboardArrowRight } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import useMounted from 'hooks/useMounted';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { permissionsApi, teamsApi } from '__api__';

const PermissionCreate = ({ open, setOpen, loading, setLoading, onCreate, treeitem }) => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [permissions, setPermissions] = useState(
    {
      "access_assets_permission": false,
      "create_assets_permission": false,
      "delete_assets_permission": false,
      "edit_treeitem_permission": false,
      "delete_treeitem_permission": false,
    }
  );

  const mounted = useMounted();
  const { t } = useTranslation()

  const handleSubmit = async () => {
    setLoading(true)
    permissionsApi.create({
      treeitem_id: treeitem.id,
      team_id: selectedTeam.id,
      ...permissions
    }).then(res => {
      setLoading(false)
      handleClose()
      if (onCreate) {
        onCreate(res.data)
      }
    }).catch(err => {
      console.log(err)
      setLoading(false)
    })
  };

  useEffect(() => {
    if (open && mounted) {
      setSelectedTeam(null)
      teamsApi.getMulti().then(res => {
        setTeams(res)
      })
    }
  }, [open, mounted])

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{t("Create a permission for the tree item")}</DialogTitle>
        <DialogContent>
          <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
            <InputLabel id="select-team">{t("Team")}</InputLabel>
            <Select
              fullWidth
              labelId="select-team-label"
              id="select-team"
              value={selectedTeam && selectedTeam.id}
              onChange={(event) => {
                setSelectedTeam(teams.find(team => team.id === event.target.value));
              }}
            >
              {teams.map(team => <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>)}
            </Select>
          </FormControl>
              {Object.keys(permissions).map(key => <Stack key={key} sx={{mt: 3}} spacing={1} direction="row" alignItems="center">
            <Typography variant="body2">{key}</Typography>
            <Switch checked={permissions[key]} onChange={(event) => setPermissions({
                ...permissions, 
                [key]: event.target.checked
              })
              } />
          </Stack>)}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <LoadingButton sx={{ my: 2 }} loading={loading} size="small" onClick={handleSubmit} disabled={!selectedTeam}>
            {t("Create")}
            <KeyboardArrowRight />
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PermissionCreate;
