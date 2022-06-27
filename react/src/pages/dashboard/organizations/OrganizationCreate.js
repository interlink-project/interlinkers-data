import {
  Alert,
  Avatar, Box, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, Input, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography
} from '@material-ui/core';
import { Close, KeyboardArrowRight } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import { TEAM_TYPES, WHO_CAN_CREATE_OPTIONS } from 'constants';
import useMounted from 'hooks/useMounted';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { organizationsApi } from '__api__';

const OrganizationCreate = ({ open, setOpen, loading, setLoading, onCreate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [teamCreationPermission, setTeamCreationPermission] = useState("administrators");
  const [isPublic, _setPublic] = useState(false);
  const setPublic = (val) => {
    if (val === false && teamCreationPermission === "anyone") {
      setTeamCreationPermission("administrators")
    }
    _setPublic(val)
  }
  const [defaultTeamType, setDefaultTeamType] = useState("");
  const [logotype, setLogotype] = useState(null);

  const [activeStep, setActiveStep] = useState(0);
  const mounted = useMounted();
  const { t } = useTranslation()

  const sendOnCreate = (data) => {
    if (mounted.current) {
      setLoading(false)
      handleClose()
      if (onCreate) {
        onCreate(data)
      }
    }
  }

  const handleNext = async () => {
    setLoading(true)
    organizationsApi.create({
      name_translations: {
        "en": name,
        "es": name,
        "it": name,
        "lv": name
      },
      description_translations: {
        "en": description,
        "es": description,
        "it": description,
        "lv": description
      },
      default_team_type: defaultTeamType,
      team_creation_permission: teamCreationPermission,
      public: isPublic
    }).then(res => {
      if (!logotype) {
        sendOnCreate(res.data)
      } else {
        organizationsApi.setFile(res.data.id, "logotype", logotype).then(res2 => {
          sendOnCreate(res2.data)
        }).catch(() => {
          sendOnCreate(res.data)
        })
      }
    }).catch(err => {
      console.log(err)
      setLoading(false)
    })
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

  useEffect(() => {
    if (open && mounted) {
      setName("")
      setDescription("")
      setLogotype(null)
      setActiveStep(0)
    }
  }, [open, mounted])

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{t("organization-creation-title")}</DialogTitle>
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
                {!logotype && <Typography variant="body1">
                  {t("Click here to add a logo")}
                </Typography>}
              </IconButton>
            </label>
            {logotype && <IconButton onClick={(event) => {
              setLogotype(null)
            }}><Close /></IconButton>}
          </Box>
            <TextField
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
              sx={{ mt: 2 }}
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
          <Alert sx={{ mt: 3 }} severity="info">{t("Public organizations's information can be accessed by any user of the platform in the 'Organizations' tab")}</Alert>

          <Stack sx={{ mt: 2 }} spacing={1} direction="row" alignItems="center">
            <Typography variant="body2">{t("Public")}</Typography>
            <Switch checked={isPublic} onChange={(event) => setPublic(event.target.checked)} />
          </Stack>

          <FormControl variant="standard" fullWidth sx={{ mt: 3 }}>
            <InputLabel id="select-creation-permission-label">{t("Who can create teams")}</InputLabel>
            <Select
              fullWidth
              labelId="select-creation-permission-label"
              id="select-creation-permission"
              value={teamCreationPermission}
              onChange={(event) => {
                setTeamCreationPermission(event.target.value);
              }}
              label={t("Who can create teams")}
            >
              {WHO_CAN_CREATE_OPTIONS(t, isPublic).map(lan => <MenuItem key={lan.value} disabled={lan.disabled} value={lan.value}>{lan.label}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl variant="standard" fullWidth sx={{ mt: 3 }}>
            <InputLabel id="select-type">{t("Default team type")}</InputLabel>
            <Select
              fullWidth
              labelId="select-type-label"
              id="select-type"
              value={defaultTeamType}
              onChange={(event) => {
                setDefaultTeamType(event.target.value);
              }}
              label={t("Default team type")}
            >
              {TEAM_TYPES(t).map(lan => <MenuItem key={lan.value} value={lan.value}>{lan.label}</MenuItem>)}
            </Select>
          </FormControl>

        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <LoadingButton sx={{ my: 2 }} loading={loading} size="small" onClick={handleNext} disabled={!name || !defaultTeamType}>
            {t("Create")}
            <KeyboardArrowRight />
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrganizationCreate;
