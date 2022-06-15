import {
  Avatar, Box, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, IconButton, Input, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography
} from '@material-ui/core';
import { KeyboardArrowRight } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import useMounted from 'hooks/useMounted';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { organizationsApi } from '__api__';
import { getLanguage } from 'translations/i18n';

const OrganizationCreate = ({ open, setOpen, loading, setLoading, onCreate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [whoCanCreate, setWhoCanCreate] = useState("administrators");
  const [isPublic, _setPublic] = useState(false);
  const setPublic = (val) => {
    if(val === false && whoCanCreate === "anyone"){
      setWhoCanCreate("administrators")
    }
    _setPublic(val)
  }
  const [type, setType] = useState("");
  const [logotype, setLogotype] = useState(null);

  const [activeStep, setActiveStep] = useState(0);
  const mounted = useMounted();
  const { t } = useTranslation()

  const ORG_TYPES = [{
    value: "citizen",
    label: t("Citizens")
  },
  {
    value: "public_office",
    label: t("Public office")
  },
  {
    value: "nonprofit_organization",
    label: t("Non profit organization")
  },
  {
    value: "forprofit_organization",
    label: t("For profit organization")
  }]


  const WHO_CAN_CREATE_OPTIONS = [{
    value: "administrators",
    label: t("Only the administrators of the organization")
  },
  {
    value: "members",
    label: t("Members of at least a team of the organization")
  },
  {
    value: "anyone",
    label: t("Anyone (the organization must be public)"),
    disabled: !isPublic
  },
  ]

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
      type,
      public: isPublic
      // team_id: team.id
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
                <Typography variant="body1">
                  {t("Click to add or edit the logo")}
                </Typography>
              </IconButton>
            </label>
          </Box>
            <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
              <InputLabel id="select-type">{t("Type")}</InputLabel>
              <Select
                fullWidth
                labelId="select-type-label"
                id="select-type"
                value={type}
                onChange={(event) => {
                  setType(event.target.value);
                }}
                label={t("Organization type")}
              >
                {ORG_TYPES.map(lan => <MenuItem key={lan.value} value={lan.value}>{lan.label}</MenuItem>)}
              </Select>
            </FormControl>

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
          <Stack sx={{ mt: 3 }} spacing={1} direction="row" alignItems="center">
            <Typography variant="body2">{t("Public")}</Typography>
            <Switch checked={isPublic} onChange={(event) => setPublic(event.target.checked)} />
          </Stack>
          <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
            <InputLabel id="select-creation-permission-label">{t("Who can create teams")}</InputLabel>
            <Select
              fullWidth
              labelId="select-creation-permission-label"
              id="select-creation-permission"
              value={whoCanCreate}
              onChange={(event) => {
                setWhoCanCreate(event.target.value);
              }}
              label={t("Who can create teams")}
            >
              {WHO_CAN_CREATE_OPTIONS.map(lan => <MenuItem key={lan.value} disabled={lan.disabled} value={lan.value}>{lan.label}</MenuItem>)}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <LoadingButton sx={{ my: 2 }} loading={loading} size="small" onClick={handleNext} disabled={!name || !type}>
            {t("Create")}
            <KeyboardArrowRight />
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrganizationCreate;
