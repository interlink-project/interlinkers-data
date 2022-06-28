import { Alert, Avatar, Button, Card, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, MobileStepper, Stack, Switch, Typography } from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import useMounted from 'hooks/useMounted';
import OrganizationsList from 'pages/dashboard/organizations/OrganizationsList';
import UsersList from 'pages/dashboard/organizations/UsersList';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { organizationsApi, permissionsApi } from '__api__';

const initial = {
  access_assets_permission: true,
  create_assets_permission: false,
  delete_assets_permission: false,
}

const PermissionCreate = ({ open, setOpen, loading, setLoading, onCreate, treeitem, existentPermissions = [] }) => {
  const [organizations, setOrganizations] = useState([]);
  const [loadingOrganizations, setLoadingOrganizations] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [permissions, setPermissions] = useState(initial);

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
      setSelectedTeam(null)
      if (onCreate) {
        onCreate(res.data)
      }
    }).catch(err => {
      console.log(err)
      setLoading(false)
    })
  };

  const getOrganizations = () => {
    setLoadingOrganizations(true)
    organizationsApi.getMulti({ search: searchValue }).then(res => {
      setOrganizations(res)
      setLoadingOrganizations(false)
    })
  }

  useEffect(() => {
    var delayDebounceFn
    if (open && mounted.current) {
      delayDebounceFn = setTimeout(() => {
        getOrganizations()
      }, searchValue ? 800 : 0)
    }
    return () => {
      if (delayDebounceFn) {
        clearTimeout(delayDebounceFn)
      }
    }
  }, [open, mounted, searchValue])

  const handleClose = () => {
    setOpen(false);
  };

  const another = t

  const repeated = selectedTeam && treeitem.permissions.find(el => {
    return el.team_id === selectedTeam.id && el.treeitem_id === treeitem.id
  }) !== undefined

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth={!selectedTeam ? "xl" : "md"}>
        <DialogTitle sx={{ bgcolor: "background.default" }}>
          {!selectedTeam ? t("Select the team to apply the permission") : t("Select the permissions for the team {{team_name}}", { team_name: selectedTeam && selectedTeam.name })}
        </DialogTitle>
        <DialogContent sx={{ bgcolor: "background.default" }}>
          {!selectedTeam && <OrganizationsList searchValue={searchValue} setSearchValue={setSearchValue} organizations={organizations} loading={loadingOrganizations} onTeamClick={setSelectedTeam} />}

          {selectedTeam && <>
            <Card sx={{ p: 1 }}>
              <CardHeader
                avatar={<Avatar
                  alt={t("Team logotype")}
                  src={selectedTeam.logotype_link}
                  variant='rounded'
                >
                  {selectedTeam.name}
                </Avatar>}
                title={selectedTeam.name}
                subheader={selectedTeam.description}
              />
            </Card>
            <UsersList size="small" disableContainer={false} users={selectedTeam.users} showLastLogin={false} />


            {!repeated ? Object.keys(permissions).map(key => <Stack key={key} sx={{ mt: 3 }} spacing={1} direction="row" alignItems="center">
            <Switch checked={permissions[key]} onChange={(event) => setPermissions({
                ...permissions,
                [key]: event.target.checked,
                access_assets_permission: true
              })
              } />
              <Typography variant="body2">{another(key)}</Typography>
              
            </Stack>) : <Alert severity='error' sx={{mt: 2}}>{t("There is already a permission for this team and treeitem")}</Alert>}
          </>}

        </DialogContent>
        <DialogActions sx={{ bgcolor: "background.default" }}>
          <MobileStepper
            variant="dots"
            steps={2}
            position="static"
            activeStep={selectedTeam ? 1 : 0}
            sx={{ flexGrow: 1 }}
            nextButton={<LoadingButton size="small" onClick={handleSubmit} disabled={!selectedTeam || repeated} loading={loading}>
                {selectedTeam ? t("Create") : t("Next")}
                <KeyboardArrowRight />
              </LoadingButton>
            }
            backButton={
              <Button size="small" onClick={() => setSelectedTeam(null)} disabled={!selectedTeam}>
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

export default PermissionCreate;
