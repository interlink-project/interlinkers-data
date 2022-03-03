import {
  Alert,
  Box, Button, TextField, ToggleButton, ToggleButtonGroup, Typography
} from '@material-ui/core';
import {
  DesktopDateRangePicker
} from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateObjective } from 'slices/process';
import { FinishedIcon, InProgressIcon } from '../Repository/Icons';

const Selected = ({ element, onSave }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [progress, setProgress] = useState(0);
  const [editMode, setEditMode] = useState(false);
  
  const dispatch = useDispatch();

  useEffect(() => {
    setDateRange([element.start_date ? new Date(element.start_date) : null, element.end_date ? new Date(element.end_date) : null])
    setProgress(element.progress)
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

    if (progress !== element.progress) {
      data.progress = progress
    }

    dispatch(updateObjective({ id: element.id, data }))
    if (onSave) {
      onSave()
    }
  }

  /*
    const handleChange = (event, newStatus) => {
        tasksApi.update(selectedTask.id, {
            status: newStatus
        }).then((res) => {
            setStatus(newStatus)
        })
    }; */

  return <Box sx={{ p: 2 }}>
    {element.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed mi odio, finibus eget porttitor eu, condimentum nec nibh. Fusce a tellus faucibus, sagittis quam eu, ornare odio. Etiam ac dolor sed elit accumsan vestibulum vel ut sapien. Duis iaculis quam in cursus euismod. Curabitur lacinia eros sit amet arcu luctus gravida. Fusce lacinia quis urna sit amet auctor. Phasellus vitae enim luctus, tempus lectus sed, feugiat elit. Nam quis nibh hendrerit, auctor eros sed, fermentum tortor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam vehicula nunc in odio consequat, eget volutpat lectus tincidunt."}
    <Typography variant="h6" sx={{ mt: 2 }}>Current status of the task:</Typography>
    <ToggleButtonGroup
      sx={{ mt: 1 }}
      color={status === "finished" ? "success" : status === "in_progress" ? "warning" : "primary"}
      value={status}
      exclusive
      fullWidth
    // onChange={handleChange}
    >
      <ToggleButton value="awaiting">Awaiting</ToggleButton>
      <ToggleButton value="in_progress">In progress <InProgressIcon /></ToggleButton>
      <ToggleButton value="finished">Finished <FinishedIcon /></ToggleButton>
    </ToggleButtonGroup>
    {editMode ? <Box sx={{ my: 3, justifyContent: "center", textAlign: "center" }}>
      <DesktopDateRangePicker
        startText="Objective start"
        value={dateRange}
        onChange={(newValue) => {
          setDateRange(newValue);
        }}

        renderInput={(startProps, endProps) => (
          <React.Fragment>
            <TextField {...startProps} />
            <Box sx={{ mx: 2 }}> to </Box>
            <TextField {...endProps} />
          </React.Fragment>
        )}
      />
    </Box> : <Box sx={{my: 2}}>
    <Typography variant="h6" sx={{ mt: 2 }}>Time planification:</Typography>
  {dateRange[0] !== null ? JSON.stringify(dateRange) : <Alert severity="warning">Not set</Alert>}
    </Box>}
    
    <Button variant="contained" fullWidth onClick={() => setEditMode(true)}>Edit</Button>
    <Button variant="outlined" sx={{mt: 2}} fullWidth color="error">Delete</Button>
  </Box>
}

export default Selected