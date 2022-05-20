import { Button, Dialog, DialogContent, Typography } from '@material-ui/core';
import useDependantTranslation from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { coproductionProcessesApi } from '__api__';
import UserSearch from './UserSearch';

const IndividualAdd = ({ open, setOpen, onChanges }) => {
  const [loading, setLoading] = useState(false);
  const mounted = useMounted();
  const [selectedIndividual, setSelectedIndividual] = useState(null);
  const { process } = useSelector((state) => state.process);
  const { t } = useDependantTranslation()

  useEffect(() => {
    if (open) {
      setSelectedIndividual(null)
    }
  }, [open]);

  const handleClose = () => {
    setOpen(false);
  };


  const handleAdd = () => {
    coproductionProcessesApi.addUser(process.id, selectedIndividual.sub).then((res) => {
      if (mounted.current) {
        handleClose()
        onChanges && onChanges(res)
      }
    })
  }

  return (<Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
    <DialogContent sx={{ m: 2 }}>
      {!selectedIndividual ? <UserSearch text="Add individual user" onClick={(user) => {
        setSelectedIndividual(user);
      }} /> : <>
        <Typography variant="h6" sx={{ textAlign: "center", my: 2 }}>{t("add-role-confirmation", { name: selectedIndividual.full_name })}</Typography>
        <Button color="warning" fullWidth onClick={handleAdd}>{t("Add")}</Button>
      </>}
    </DialogContent>

  </Dialog>);
};

export default IndividualAdd;
