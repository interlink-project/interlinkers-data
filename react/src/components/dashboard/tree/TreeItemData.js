import {
  Alert,
  Box, Button, Chip, Divider, IconButton, Link, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography
} from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import {
  DesktopDateRangePicker, LoadingButton
} from '@material-ui/lab';
import ConfirmationButton from 'components/ConfirmationButton';
import { FinishedIcon, InProgressIcon } from 'components/dashboard/assets';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { deleteObjective, deletePhase, deleteTask, updateObjective, updatePhase, updateTask } from 'slices/process';
import { tree_items_translations } from 'utils/someCommonTranslations';
import { statusIcon, StatusText } from '../assets/Icons';

const TreeItemData = ({ language, processId, element }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const t = useCustomTranslation(language)

  const restart = (el) => {
    setName(el.name)
    setDescription(el.description)
    setStatus(el.status)
    setDateRange([el.start_date ? new Date(el.start_date) : null, el.end_date ? new Date(el.end_date) : null])
  }

  useEffect(() => {
    restart(element)
  }, [editMode, element])

  const callback = () => {
    setSaving(false)
    setEditMode(false)
  }

  const saveData = () => {
    setSaving(true)
    const data = {}

    const start_date = dateRange[0] && dateRange[0].toISOString().slice(0, 10)
    const end_date = dateRange[1] && dateRange[1].toISOString().slice(0, 10)
    if (start_date !== element.start_date) {
      data.start_date = start_date
    }
    if (end_date !== element.end_date) {
      data.end_date = end_date
    }
    if (status !== element.status) {
      data.status = status
    }
    if (name !== element.name) {
      data.name = name
    }
    if (description !== element.description) {
      data.description = description
    }

    if (element.type === "task") {
      dispatch(updateTask({ id: element.id, data, callback }))
    }
    else if (element.type === "objective") {
      dispatch(updateObjective({ id: element.id, data, callback }))
    }
    else if (element.type === "phase") {
      dispatch(updatePhase({ id: element.id, data, callback }))
    }

  }

  const deleteTreeItem = () => {
    
    console.log("DELETING", element.type)
    if (element.type === "task") {
      dispatch(deleteTask({ id: element.id, callback }))
    }
    else if (element.type === "objective") {
      dispatch(deleteObjective({ id: element.id, callback }))
    }
    else if (element.type === "phase") {
      dispatch(deletePhase({ id: element.id, callback }))
    }
  }

  const treeitem_translations = tree_items_translations(t)


  return <>
    {!editMode && <IconButton onClick={() => setEditMode(true)} sx={{
      position: "relative",
      right: 0,
      float: "right"
    }}>
      <Edit />
    </IconButton>}
    <Typography variant="h6">
      {t("Name")}
    </Typography>
    {editMode ? <TextField onChange={(event) => {
      setName(event.target.value);
    }} variant="standard" fullWidth value={name} /> : name}
    <Typography variant="h6" sx={{ mt: 2 }}>
    {t("Description")}
    </Typography>
    {editMode ? <TextField onChange={(event) => {
      setDescription(event.target.value);
    }} multiline fullWidth variant="standard" value={description} /> : <p style={{
      whiteSpace: 'pre-wrap',
      marginTop: 0
    }}>{description}</p>}

    {element.problemprofiles && <><Typography variant="h6">
      {t("Problem profiles")}
    </Typography>
    <p style={{
      whiteSpace: 'pre-wrap',
      marginTop: 0
    }}>{element.problemprofiles.map(pp => <Chip sx={{mr: 1, mt: 1}} label={pp} key={`task-problemprofile-${pp}`} />)}</p></>}
    
    <Typography variant="h6" sx={{ mt: 2 }}>{t("Current status")}</Typography>
    {editMode ? <>
      {element.type === "task" ? <ToggleButtonGroup
        sx={{ mt: 1 }}
        color={status === "finished" ? "success" : status === "in_progress" ? "warning" : "primary"}
        value={status}
        exclusive
        fullWidth
        onChange={(event, newStatus) => {
          setStatus(newStatus)
        }}
      >
        <ToggleButton value="awaiting">{t("Awaiting")}</ToggleButton>
        <ToggleButton value="in_progress">{t("In progress")}<InProgressIcon /></ToggleButton>
        <ToggleButton value="finished">{t("Finished")} <FinishedIcon /></ToggleButton>
      </ToggleButtonGroup> : <Alert severity="warning" sx={{mt: 1}}>{t("Status can only be set for tasks")}</Alert>}</>

      : <div style={{ alignItems: "center", color: "primary.main" }}>
        <StatusText status={status} language={language} />
        {statusIcon(status)}
      </div>
    }
    <Link
      component="button"
      variant="h6"
      onClick={() => {
        navigate(`/dashboard/coproductionprocesses/${processId}/workplan`);
      }}
      sx={{ mt: 2 }}
      underline="none"
    >
      {t("Time planification")}:
    </Link>

    {editMode ? <>
      {element.type === "task" ? <Box justifyContent="center" sx={{ mt: 2 }}>
        <DesktopDateRangePicker
          startText="Start date"
          endText="End date"
          value={dateRange}
          onChange={(newValue) => {
            setDateRange(newValue);
          }}

          renderInput={(startProps, endProps) => (
            <Stack spacing={3} direction="row" sx={{ width: "100%", alignItems: "center", justifyContent: "center" }} >
              <TextField {...startProps} />
              <TextField {...endProps} />
            </Stack>
          )}
        />
      </Box> : <Alert severity="warning" sx={{mt: 1}}>{t("Start and end dates can only be set for tasks")}</Alert>}</> : <Box sx={{ mt: 2 }}>
      {dateRange[0] !== null ? <>
        <b>{t("Start")}:  </b>{moment(dateRange[0]).format("LL")}
        <br />
        <b>{t("End")}:  </b>{moment(dateRange[1]).format("LL")}
      </> : <Alert severity="warning">{t("Not set")}</Alert>}
    </Box>}

    {editMode &&
      <Box sx={{ width: "100%", justifyContent: "center", textAlign: "center" }}>
        <Stack sx={{ mt: 2 }} justifyContent="center" direction="row" spacing={2}>
          <Button size="small" variant="outlined" onClick={() => setEditMode(false)} color="warning">{t("Discard changes")}</Button>
          <LoadingButton loading={saving} sx={{ width: "200px" }} variant="contained" onClick={saveData} color="primary" size="small">{t("Save")}</LoadingButton>

        </Stack>

        <Divider sx={{ my: 2 }}>
        {t("other actions")}
        </Divider>
        <ConfirmationButton
          Actionator={({ onClick }) => <Button size="small" variant="text" onClick={onClick} color="error">{t("Remove", {what: treeitem_translations[element.type].toLowerCase()})}</Button>}
          ButtonComponent={({ onClick }) => <LoadingButton sx={{ mt: 1 }} fullWidth variant='contained' color="error" onClick={onClick}>{t("Confirm deletion")}</LoadingButton>}
          onClick={deleteTreeItem}
          text={t("Are you sure?")}
        />
      </Box>}
  </>

}

export default TreeItemData