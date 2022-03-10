import {
  Alert,
  Box, Button, CardActions, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography
} from '@material-ui/core';
import {
  DesktopDateRangePicker
} from '@material-ui/lab';
import { FinishedIcon, InProgressIcon } from 'components/dashboard/assets';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateObjective, updatePhase, updateTask } from 'slices/process';
import { HTMLtoText } from 'utils/safeHTML';
import { statusText, statusIcon } from '../assets/Icons';

const TreeItemData = ({ element, type, onSave = null, showType = true}) => {
  const [dateRange, setDateRange] = useState([element.start_date ? new Date(element.start_date) : null, element.end_date ? new Date(element.end_date) : null]);
  const [status, setStatus] = useState(element.status);
  const [name, setName] = useState(element.name);
  const [description, setDescription] = useState(element.description);
  const [editMode, _setEditMode] = useState(false);

  const restart = () => {
    setName(element.name)
    setDescription(element.description)
    setStatus(element.status)
    setDateRange([element.start_date ? new Date(element.start_date) : null, element.end_date ? new Date(element.end_date) : null])
  }

  const setEditMode = (bool) => {
    restart()
    _setEditMode(bool)
  }

  useEffect(() => {
    setEditMode(false)
  }, [element])

  const dispatch = useDispatch();

  const saveData = () => {
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

    if (type === "task") {
      console.log({ id: element.id, data })
      dispatch(updateTask({ id: element.id, data }))
    }
    else if (type === "objective") {
      dispatch(updateObjective({ id: element.id, data }))
    }
    else if (type === "phase") {
      dispatch(updatePhase({ id: element.id, data }))
    }
    setEditMode(false)
    if (onSave) {
      onSave()
    }
  }

  return <>
    {type && showType && <><Typography variant="h6">
      Type
    </Typography>
      {type === "task" && "Task"}
      {type === "objective" && "Objective"}
      {type === "phase" && "Phase"}</>}

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
    }} multiline fullWidth variant="standard" value={description} /> :<p style={{
      whiteSpace: 'pre-wrap'
      }}>{description}</p>}
    <Typography variant="h6" sx={{ mt: 2 }}>Current status of the task:</Typography>
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

      : <div style={{ alignItems: "center" }}>
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

    <CardActions sx={{ justifyContent: "center" }}>
      <Button sx={{ mt: 2 }} size="small" variant="outlined" onClick={() => setEditMode(!editMode)} color={editMode ? "error" : "primary"}>{editMode ? "Discard changes" : "Edit"}</Button>
      {editMode && <Button sx={{ mt: 2 }} variant="contained" onClick={saveData} color="primary" size="small">Save</Button>}

    </CardActions>
  </>

}

export default TreeItemData