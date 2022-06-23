import { Avatar, Button, Card, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, MobileStepper, Stack, Switch, Typography } from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import useMounted from 'hooks/useMounted';
import OrganizationsList from 'pages/dashboard/organizations/OrganizationsList';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { permissionsList } from 'utils/someCommonTranslations';
import { organizationsApi, permissionsApi } from '__api__';

const PermissionCreate = ({ open, setOpen, loading, setLoading, onCreate, treeitem }) => {
  const [organizations, setOrganizations] = useState([]);
  const [loadingOrganizations, setLoadingOrganizations] = useState(false);
  const [selectedTeam, _setSelectedTeam] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [permissions, setPermissions] = useState(permissionsList.reduce((current, element) => ({ ...current, [element]: false }), {}));

  const setSelectedTeam = (team) => {
    _setSelectedTeam(team)
    setActiveStep(1)
  }

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
    _setSelectedTeam(null)
    if (open && mounted) {
      setLoadingOrganizations(true)
      organizationsApi.getMulti().then(res => {
        setOrganizations(res)
        setLoadingOrganizations(false)
      })
    }
  }, [open, mounted])

  const handleClose = () => {
    setOpen(false);
  };

  const handleNext = () => {
    if (activeStep === 0) {
      setActiveStep(1)
    }
    else {
      handleSubmit()
    }
  }

  const another = t

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth={activeStep === 0 ? "xl" : "md"}>
        <DialogTitle sx={{ bgcolor: "background.default" }}>
          {activeStep === 0 ? t("Select the team to apply the permission") : t("Select the permissions for the team {{team_name}}", { team_name: selectedTeam && selectedTeam.name })}
        </DialogTitle>
        <DialogContent sx={{ bgcolor: "background.default" }}>
          {activeStep === 0 && <OrganizationsList searchValue={searchValue} setSearchValue={setSearchValue} organizations={organizations} loading={loadingOrganizations} onTeamClick={setSelectedTeam} />}

          {activeStep === 1 && selectedTeam && <>
          <Card sx={{p: 1}}>
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
            

            {Object.keys(permissions).map(key => <Stack key={key} sx={{ mt: 3 }} spacing={1} direction="row" alignItems="center">
              <Typography variant="body2">{another(key)}</Typography>
              <Switch checked={permissions[key]} onChange={(event) => setPermissions({
                ...permissions,
                [key]: event.target.checked
              })
              } />
            </Stack>)}
          </>}

        </DialogContent>
        <DialogActions sx={{ bgcolor: "background.default" }}>
          <MobileStepper
            variant="dots"
            steps={2}
            position="static"
            activeStep={activeStep}
            sx={{ flexGrow: 1 }}
            nextButton={
              <LoadingButton size="small" onClick={handleNext} disabled={!selectedTeam} loading={loading}>
                {activeStep === 1 ? t("Create") : t("Next")}
                <KeyboardArrowRight />
              </LoadingButton>
            }
            backButton={
              <Button size="small" onClick={() => setActiveStep(0)} disabled={activeStep === 0}>
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
