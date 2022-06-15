import { useMatomo } from '@datapunt/matomo-tracker-react';
import {
  Alert,
  Box, Button, Chip, Divider, IconButton, Link, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, ToggleButton, ToggleButtonGroup, Typography
} from '@material-ui/core';
import { CheckOutlined, Edit } from '@material-ui/icons';
import {
  DesktopDateRangePicker, LoadingButton
} from '@material-ui/lab';
import ConfirmationButton from 'components/ConfirmationButton';
import { FinishedIcon, InProgressIcon } from 'components/dashboard/assets';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import { update } from 'lodash';
import moment from 'moment';
import PermissionCreate from 'pages/dashboard/coproductionprocesses/Tabs/Team/PermissionCreate';
import TeamProfile from 'pages/dashboard/organizations/TeamProfile';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { getTree, setUpdatingTree } from 'slices/process';
// import { deleteObjective, deletePhase, deleteTask,  } from 'slices/process';
import { tree_items_translations } from 'utils/someCommonTranslations';
import { objectivesApi, phasesApi, tasksApi } from '__api__';
import { AwaitingIcon, statusIcon, StatusText } from '../assets/Icons';

const apis = {
  task: tasksApi,
  objective: objectivesApi,
  phase: phasesApi
}
const TreeItemData = ({ language, processId, element }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [selectedTeam, setSelectedTeam] = React.useState(null);

  const navigate = useNavigate()
  const dispatch = useDispatch();
  const t = useCustomTranslation(language)
  const { trackEvent } = useMatomo()

  const [permissionCreatorOpen, setOpenPermissionCreator] = useState(false);
  const [creatingPermission, setCreatingPermission] = useState(false);

  const restart = (el) => {
    setName(el.name)
    setDescription(el.description)
    setStatus(el.status)
    setDateRange([el.start_date ? new Date(el.start_date) : null, el.end_date ? new Date(el.end_date) : null])
  }

  useEffect(() => {
    restart(element)
  }, [editMode])

  useEffect(() => {
    setEditMode(false)
    restart(element)
  }, [element])

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
    trackEvent({
      category: processId,
      action: 'update-treeitem',
      name: element.id,
      customDimensions: [
        {
          id: 1,
          value: processId
        },
        {
          id: 2,
          value: JSON.stringify(data)
        }
      ]
    })
    apis[element.type].update(element.id, data).then(() => {
      update(element.type === "phase" ? element.id : element.phase_id, element.id);
    });
  }

  const update = (selectedPhaseTabId, selectedTreeItemId) => {
    dispatch(getTree(processId, selectedPhaseTabId, selectedTreeItemId));
  }

  const deleteTreeItem = () => {
    trackEvent({
      category: processId,
      action: 'delete-treeitem',
      name: element.id,
      customDimensions: [
        {
          id: 1,
          value: processId
        }
      ]
    })
    dispatch(setUpdatingTree(true));
    apis[element.type].delete(element.id).then(() => {
      update(element.type === "phase" ? element.id : element.phase_id, element.type === "phase" ? element.id : element.phase_id)
    });
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

    {false && element.problemprofiles && <>
      <Typography variant="h6">
        {t("Problem profiles")}
      </Typography>
      {element.problemprofiles.map(pp => <Chip sx={{ mr: 1, mt: 1 }} label={pp} key={`task-problemprofile-${pp}`} />)}
    </>}

    <Typography variant="h6" sx={{ mt: 2 }}><>{t("Current status")}</></Typography>
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
        <ToggleButton value="awaiting"><>{t("Awaiting")}<AwaitingIcon /></></ToggleButton>
        <ToggleButton value="in_progress"><>{t("In progress")}<InProgressIcon /></></ToggleButton>
        <ToggleButton value="finished"><>{t("Finished")} <FinishedIcon /></></ToggleButton>
      </ToggleButtonGroup> : <Alert severity="warning" sx={{ mt: 1 }}><>{t("Status can only be set for tasks")}</></Alert>}</>

      : <Stack alignItems="center" direction="row" spacing={1}>
        {statusIcon(status)}
        <div>
          <StatusText status={status} language={language} />
        </div>
      </Stack>
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
      </Box> : <Alert severity="warning" sx={{ mt: 1 }}>{t("Start and end dates can only be set for tasks")}</Alert>}</> : <Box sx={{ mt: 2 }}>
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
          Actionator={({ onClick }) => <Button size="small" variant="text" onClick={onClick} color="error">{t("Remove {{what}}", { what: treeitem_translations[element.type].toLowerCase() })}</Button>}
          ButtonComponent={({ onClick }) => <LoadingButton sx={{ mt: 1 }} fullWidth variant='contained' color="error" onClick={onClick}>{t("Confirm deletion")}</LoadingButton>}
          onClick={deleteTreeItem}
          text={t("Are you sure?")}
        />
      </Box>}


    <Typography variant="h6" sx={{ mt: 2 }}>
      {t("Permissions")}
    </Typography>
    {selectedTeam && <TeamProfile teamId={selectedTeam.id} open={true} setOpen={setSelectedTeam} />}
    {element.permissions && element.permissions.length > 0 ? <Table aria-label="admins-table">
      <TableHead>
        <TableRow>
          <TableCell align="center"><>{t("Team")}</></TableCell>
          <TableCell align="center"><>{t("View resources")}</></TableCell>
          <TableCell align="center"><>{t("Create resources")}</></TableCell>
          <TableCell align="center"><>{t("Delete resources")}</></TableCell>
          <TableCell align="center"><>{t("Update tree items")}</></TableCell>
          <TableCell align="center"><>{t("Delete tree items")}</></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {element.permissions.map((permission) => (
          <TableRow hover key={permission.id}>
            <TableCell align="center">
              
              <Button onClick={() => setSelectedTeam(permission.team_id)} variant="contained">{permission.team_id}</Button>
            </TableCell>
            <TableCell align="center">
              {permission.view_assets_permission && <CheckOutlined />}
            </TableCell>
            <TableCell align="center">
              {permission.create_assets_permission && <CheckOutlined />}
            </TableCell>
            <TableCell align="center">
            {permission.delete_assets_permission && <CheckOutlined />}
            </TableCell>
            <TableCell align="center">
            {permission.edit_treeitem_permission && <CheckOutlined />}
            </TableCell>
            <TableCell align="center">
            {permission.delete_treeitem_permission && <CheckOutlined />}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table> : <Alert sx={{ mt: 2 }} severity="info">{t("There are no permissions for this tree item")}</Alert>}
    <Button sx={{ mt: 2 }} onClick={() => setOpenPermissionCreator(true)} fullWidth variant="contained">{t("Add new permission")}</Button>
    <PermissionCreate
      open={permissionCreatorOpen}
      setOpen={setOpenPermissionCreator}
      onCreate={() => {
        update(element.type === "phase" ? element.id : element.phase_id, element.id)
      }}
      loading={creatingPermission}
      setLoading={setCreatingPermission}
      treeitem={element}
    />
  </>

}

export default TreeItemData