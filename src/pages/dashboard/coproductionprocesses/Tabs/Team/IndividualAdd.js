import { Button, Dialog, DialogContent, TextField, Typography } from '@material-ui/core';
import { Cancel, CheckCircle } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import useMounted from 'hooks/useMounted';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { coproductionProcessesApi, usersApi } from '__api__';

const IndividualAdd = ({ open, setOpen, onChanges }) => {
  const [loading, setLoading] = useState(false);
  const mounted = useMounted();
  const [selectedIndividual, setSelectedIndividual] = useState(null);
  const [individualSearchResult, setResultIndividualSearch] = useState(null);
  const { process } = useSelector((state) => state.process);
  const [emailValue, setEmailValue] = useState("");

  const handleClick = (event) => {
    setSelectedIndividual(individualSearchResult);
  };

  useEffect(() => {
    if (open) {
      setSelectedIndividual(null)
      setResultIndividualSearch(null)
    }
  }, [open]);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    var delayDebounceFn
    if (emailValue) {
      setLoading(true)
      delayDebounceFn = setTimeout(() => {
        usersApi.get_cache(emailValue).then(res => {
          setResultIndividualSearch(res.data)
          console.log(res.data)
        }).catch(() => {
          setResultIndividualSearch(null)
        }).finally(() => {
          setLoading(false)
        })
      }, 1000)
    }
    return () => clearTimeout(delayDebounceFn)
  }, [emailValue])

  const handleAdd = () => {
    coproductionProcessesApi.addUser(process.id, selectedIndividual.sub).then((res) => {
      handleClose()
      onChanges && onChanges(res)
    })
  }

  return (<Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
    <DialogContent sx={{ m: 2 }}>
      {!selectedIndividual ? <>
        <TextField
          margin="dense"
          label="Email Address"
          type="email"
          fullWidth
          variant="standard"
          value={emailValue}
          onChange={(e) => {
            setEmailValue(e.target.value)
          }}
        />

        <LoadingButton loading={loading} fullWidth variant="text" color='primary' onClick={handleClick}
          disabled={!individualSearchResult}
          endIcon={individualSearchResult ? <CheckCircle /> : emailValue && <Cancel color='error' />}
          sx={{ mt: 1 }}
        >Add user</LoadingButton>
      </> : <>
        <Typography variant="h6" sx={{ textAlign: "center", my: 2 }}>Are you sure you want to add "{selectedIndividual.full_name}" to this process? It will be added with the default role</Typography>
        <Button color="warning" fullWidth onClick={handleAdd}>Add</Button>
      </>}
    </DialogContent>

  </Dialog>);
};

export default IndividualAdd;
