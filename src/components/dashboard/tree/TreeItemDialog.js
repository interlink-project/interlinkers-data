import {
  Alert,
  Box, Button, CardActions, Dialog, TextField, ToggleButton, ToggleButtonGroup, Typography
} from '@material-ui/core';
import {
  AcUnit
} from '@material-ui/icons';
import {
  DesktopDateRangePicker
} from '@material-ui/lab';
import { FinishedIcon, InProgressIcon } from 'components/dashboard/assets';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateObjective, updateTask } from 'slices/process';
import { statusText, statusIcon } from '../assets/Icons';

const TreeItemDialog = ({ element, onSave, open, setOpen }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [status, setStatus] = useState(element.status);
  const [name, setName] = useState(element.name);
  const [description, setDescription] = useState(element.description);
  const [editMode, setEditMode] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setDateRange([element.start_date ? new Date(element.start_date) : null, element.end_date ? new Date(element.end_date) : null])
  }, [element]);

  const dataToSend = async () => {
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
      dispatch(updateTask({ id: element.id, data }))


    }
    else if (element.type === "objective") {
      dispatch(updateObjective({ id: element.id, data }))

    }
    if (onSave) {
      onSave()
    }
  }

  const handleChange = (event, newStatus) => {
    setStatus(newStatus)
  };

  return <Dialog onClose={() => setOpen(false)} open={open}>
    <Box sx={{ p: 2 }}>

      <Typography variant="h6" sx={{ mt: 2 }}>
        Type
      </Typography>
      {element.type === "task" && "Task"}
      {element.type === "objective" && "Objective"}
      {element.type === "phase" && "Phase"}
      <Typography variant="h6" sx={{ mt: 2 }}>
        Name
      </Typography>
      {editMode ? <TextField variant="standard" fullWidth value={name} /> : name}
      <Typography variant="h6" sx={{ mt: 2 }}>
        Description
      </Typography>
      {editMode ? <TextField multiline fullWidth variant="standard" value={description} /> : description}
      <Typography variant="h6" sx={{ mt: 2 }}>Current status of the task:</Typography>
      {editMode ? <ToggleButtonGroup
        sx={{ mt: 1 }}
        color={status === "finished" ? "success" : status === "in_progress" ? "warning" : "primary"}
        value={status}
        exclusive
        fullWidth
        onChange={handleChange}
      >
        <ToggleButton value="awaiting">Awaiting</ToggleButton>
        <ToggleButton value="in_progress">In progress <InProgressIcon /></ToggleButton>
        <ToggleButton value="finished">Finished <FinishedIcon /></ToggleButton>
      </ToggleButtonGroup> : <>
      {statusText(status)}
      {statusIcon(status)}
      </>
      }
      <Typography variant="h6" sx={{ mt: 2 }}>Time planification:</Typography>
      {editMode ? <Box sx={{ mt: 2, justifyContent: "center", textAlign: "center" }}>
        <DesktopDateRangePicker
          startText="Start date"
          endText="End date"
          value={dateRange}
          onChange={(newValue) => {
            setDateRange(newValue);
          }}
          sx={{ justifyContent: "center" }}

          renderInput={(startProps, endProps) => (
            <React.Fragment>
              <TextField {...startProps} />
              <Box sx={{ mx: 2 }}> to </Box>
              <TextField {...endProps} />
            </React.Fragment>
          )}
        />
      </Box> : <Box sx={{ my: 2 }}>
        {dateRange[0] !== null ? JSON.stringify(dateRange) : <Alert severity="warning">Not set</Alert>}
      </Box>}

      <CardActions sx={{ justifyContent: "center" }}>
        <Button sx={{ mt: 2 }} size="small" variant="outlined" onClick={() => setEditMode(!editMode)} color={editMode ? "error" : "primary"}>{editMode ? "Discard changes" : "Edit"}</Button>
        {editMode && <Button sx={{ mt: 2 }} variant="contained" onClick={dataToSend} color="primary" size="small">Save</Button>}

      </CardActions>
    </Box>
  </Dialog>

}

export default TreeItemDialog