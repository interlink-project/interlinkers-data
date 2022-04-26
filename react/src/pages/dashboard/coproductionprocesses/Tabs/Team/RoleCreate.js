import { useEffect, useState } from 'react';
import {
  Box,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Dialog,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  useTheme,
  MobileStepper,

} from '@material-ui/core';
import { Add, Delete, Folder, KeyboardArrowRight, KeyboardArrowLeft, CheckCircle, Cancel } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import useAuth from 'hooks/useAuth';
import { rolesApi, teamsApi, usersApi } from '__api__';
import useDependantTranslation from 'hooks/useDependantTranslation';

const RoleCreate = ({ onCreate, coproductionprocess_id, possiblePermissions }) => {
  const [open, setOpen] = useState(false);
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState([]);

  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const t = useDependantTranslation()

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
      console.log({ name, description, permissions, coproductionprocess_id })
      rolesApi.create(
        { name, description, permissions, coproductionprocess_id }
      ).then(res => sendOnCreate(res.data)).catch(res => console.log(res.data))
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function getStyles(name, permissions, theme) {
    return {
      fontWeight:
        permissions.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPermissions(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <>
      <Button fullWidth variant="contained" color='primary' onClick={handleClickOpen}>
      {t("role-creation-title")}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t("role-creation-title")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
          {t("role-creation-description")}
            
          </DialogContentText>
          {activeStep === 0 && <>
            <TextField
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
            <FormControl sx={{ m: 1 }} fullWidth>
              <InputLabel id="permissions-select-label">{t("Permissions")}</InputLabel>
              <Select
                labelId="permissions-select-label"
                multiple
                value={permissions}
                onChange={handleChange}
                input={<OutlinedInput label={t("Permissions")} />}
              >
                {possiblePermissions.map((permission) => (
                  <MenuItem
                    key={permission.code}
                    value={permission.code}
                    style={getStyles(permission.label, permissions, theme)}
                  >
                    {permission.label}
                  </MenuItem>
                ))}
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
              <Button size="small" onClick={handleNext}>
                {activeStep === 1 ? t("Create") : t("Next")}
                <KeyboardArrowRight />
              </Button>
            }
            backButton={
              <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
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

export default RoleCreate;
