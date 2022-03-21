import {
  Alert,
  Box, Button, Stack, CardActions, IconButton, TextField, ToggleButton, ToggleButtonGroup, Typography, Divider
} from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import {
  DesktopDateRangePicker, LoadingButton
} from '@material-ui/lab';
import { FinishedIcon, InProgressIcon } from 'components/dashboard/assets';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteObjective, deletePhase, deleteTask, updateObjective, updatePhase, updateTask } from 'slices/process';
import { HTMLtoText } from 'utils/safeHTML';
import { statusText, statusIcon } from '../assets/Icons';

const TreeItemData = ({ element, type, onSave = null, showType = true }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const restart = (el) => {
    setName(el.name)
    setDescription(el.description)
    setStatus(el.status)
    setDateRange([el.start_date ? new Date(el.start_date) : null, el.end_date ? new Date(el.end_date) : null])
  }

  useEffect(() => {
    restart(element)
  }, [editMode, element])

  const dispatch = useDispatch();

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

    const callback = () => {
      setSaving(false)
      setEditMode(false)
      if (onSave) {
        onSave()
      }
    }

    if (type === "task") {
      dispatch(updateTask({ id: element.id, data, callback }))
    }
    else if (type === "objective") {
      dispatch(updateObjective({ id: element.id, data, callback }))
    }
    else if (type === "phase") {
      dispatch(updatePhase({ id: element.id, data, callback }))
    }
    
  }

  const deleteTreeItem = () => {
    const callback = () => {
      setSaving(false)
      setEditMode(false)
      if (onSave) {
        onSave()
      }
    }

    if (type === "task") {
      dispatch(deleteTask({ id: element.id, callback }))
    }
    else if (type === "objective") {
      dispatch(deleteObjective({ id: element.id, callback }))
    }
    else if (type === "phase") {
      dispatch(deletePhase({ id: element.id, callback }))
    }
  }

  return <>
    {type && showType && <>
      <Typography variant="h6">
        Type
      </Typography>
      {type === "task" && "Task"}
      {type === "objective" && "Objective"}
      {type === "phase" && "Phase"}</>}
    {!editMode && <IconButton onClick={() => setEditMode(true)} sx={{
      position: "relative",
      right: 0,
      float: "right"
    }}>
      <Edit />
    </IconButton>}
    <Typography variant="h6" sx={showType ? { mt: 2 } : {}}>
      Name
    </Typography>
    {editMode ? <TextField onChange={(event) => {
      setName(event.target.value);
    }} variant="standard" fullWidth value={name} /> : name}
    <Typography variant="h6" sx={{ mt: 2 }}>
      Description
    </Typography>
    {editMode ? <TextField onChange={(event) => {
      setDescription(event.target.value);
    }} multiline fullWidth variant="standard" value={description} /> : <p style={{
      whiteSpace: 'pre-wrap',
      marginTop: 0
    }}>{description}</p>}
    <Typography variant="h6" sx={{ mt: 2 }}>Current status of the {type}:</Typography>
    {editMode ? <>
      {type === "task" ? <ToggleButtonGroup
        sx={{ mt: 1 }}
        color={status === "finished" ? "success" : status === "in_progress" ? "warning" : "primary"}
        value={status}
        exclusive
        fullWidth
        onChange={(event, newStatus) => {
          setStatus(newStatus)
        }}
      >
        <ToggleButton value="awaiting">Awaiting</ToggleButton>
        <ToggleButton value="in_progress">In progress <InProgressIcon /></ToggleButton>
        <ToggleButton value="finished">Finished <FinishedIcon /></ToggleButton>
      </ToggleButtonGroup> : <Alert severity="warning">Only tasks can be modified</Alert>}</>

      : <div style={{ alignItems: "center", color: "primary.main"}}>
        {statusText(status)}
        {statusIcon(status)}
      </div>
    }
    <Typography variant="h6" sx={{ mt: 2 }}>Time planification:</Typography>
    {editMode ? <>
      {type === "task" ? <Box justifyContent="center" sx={{ mt: 2 }}>
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
      </Box> : <Alert severity="warning">Only tasks can be modified</Alert>}</> : <Box sx={{ mt: 2 }}>
      {dateRange[0] !== null ? <>
        <b>Start:  </b>{moment(dateRange[0]).format("LL")}
        <br />
        <b>End:  </b>{moment(dateRange[1]).format("LL")}
      </> : <Alert severity="warning">Not set</Alert>}
    </Box>}

    {editMode && 
      <Box sx={{ width: "100%", justifyContent: "center", textAlign: "center" }}>
        <Stack sx={{ mt: 2 }} justifyContent="center" direction="row" spacing={2}>
          <Button size="small" variant="outlined" onClick={() => setEditMode(false)} color="warning">Discard changes</Button>
          <LoadingButton loading={saving} sx={{ width: "200px" }} variant="contained" onClick={saveData} color="primary" size="small">Save</LoadingButton>

        </Stack>

        <Divider sx={{my: 2}}>
          other actions
        </Divider>
        <LoadingButton size="small" variant="text" onClick={() => deleteTreeItem()} color="error">Remove {type}</LoadingButton>

      </Box>}
  </>

}

export default TreeItemData