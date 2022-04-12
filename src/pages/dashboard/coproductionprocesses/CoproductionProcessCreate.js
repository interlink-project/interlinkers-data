import {
  Avatar, Box, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, Input, InputLabel, MenuItem, Select, TextField
} from '@material-ui/core';
import { KeyboardArrowRight } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import useMounted from 'hooks/useMounted';
import { useState, useEffect } from 'react';
import { getInitialLanguage, LANGUAGES } from 'translations/i18n';
import { coproductionProcessesApi } from '__api__';

const CoproductionprocessCreate = ({ open, setOpen, loading, setLoading, onCreate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState(getInitialLanguage());
  const [logotype, setLogotype] = useState(null);

  const [activeStep, setActiveStep] = useState(0);
  const mounted = useMounted();

  const sendOnCreate = (data) => {
    if (mounted) {
      setLoading(false)
      handleClose()
      if (onCreate) {
        onCreate(data)
      }
    }
  }

  const handleNext = async () => {
    setLoading(true)
    console.log({
      name,
      description,
      language
      // team_id: team.id
    })
    coproductionProcessesApi.create({
      name,
      description,
      language
      // team_id: team.id
    }).then(res => {
      if (!logotype) {
        sendOnCreate(res.data)
      } else {
        coproductionProcessesApi.setFile(res.data.id, "logotype", logotype).then(res2 => {
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
            <FormControl variant="standard" fullWidth sx={{mt: 2}}>
              <InputLabel id="select-language">Language</InputLabel>
              <Select
                fullWidth
                labelId="select-language-label"
                id="select-language"
                value={language}
                onChange={(event) => {
                  setLanguage(event.target.value);
                }}
                label="language"
              >
                {LANGUAGES.map(lan => <MenuItem value={lan.value}>{lan.label}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField
              sx={{mt: 2}}
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
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <LoadingButton sx={{ my: 2 }} loading={loading} size="small" onClick={handleNext} disabled={!name}>
            Create
            <KeyboardArrowRight />
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CoproductionprocessCreate;
