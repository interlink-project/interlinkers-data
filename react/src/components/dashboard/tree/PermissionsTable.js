import {
  Alert, Avatar, Button, IconButton, Table, TableBody, TableCell, TableHead, TableRow
} from '@material-ui/core';
import { CheckOutlined, Delete } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import ConfirmationButton from 'components/ConfirmationButton';
import { user_id } from 'contexts/CookieContext';
import useAuth from 'hooks/useAuth';
import useDependantTranslation, { useCustomTranslation } from 'hooks/useDependantTranslation';
import PermissionCreate from 'pages/dashboard/coproductionprocesses/Tabs/Team/PermissionCreate';
import TeamProfile from 'pages/dashboard/organizations/TeamProfile';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getTree } from 'slices/process';
import { tree_items_translations } from 'utils/someCommonTranslations';

const PermissionRow = ({ permission, setSelectedTeam }) => {
  const { user } = useAuth()
  const { t } = useDependantTranslation()

  const handleDelete = () => {
    console.log("DELETE", permission.id)
  }

  return <TableRow hover key={permission.id}>
    <TableCell align="center">
      <Button startIcon={<Avatar src={permission.team.logotype_link} />} onClick={() => setSelectedTeam(permission.team_id)} variant="contained">{permission.team && permission.team.name} {t("team")}</Button>
    </TableCell>
    <TableCell align="center">
      {permission.user_id == user_id || user.teams_ids.includes(permission.team_id) && <CheckOutlined />}
    </TableCell>
    <TableCell align="center">
      {permission.access_assets_permission && <CheckOutlined />}
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
    <TableCell align="center">
      <ConfirmationButton
        key={`${permission.id}-delete-action`}
        Actionator={({ onClick }) => <IconButton onClick={onClick}>
          <Delete />
        </IconButton>}
        ButtonComponent={({ onClick }) => <LoadingButton sx={{ mt: 1 }} fullWidth variant='contained' color="error" onClick={onClick}>{t("Confirm deletion")}</LoadingButton>}
        onClick={handleDelete}
        text={t("Are you sure?")} />

    </TableCell>
  </TableRow>
}

const PermissionsTable = ({ language, processId, element, isAdministrator }) => {
  const [selectedTeam, setSelectedTeam] = React.useState(null);

  const dispatch = useDispatch();
  const t = useCustomTranslation(language)
  const treeitem_translations = tree_items_translations(t)

  const [permissionCreatorOpen, setOpenPermissionCreator] = useState(false);
  const [creatingPermission, setCreatingPermission] = useState(false);
  const update = (selectedPhaseTabId, selectedTreeItemId) => {
    dispatch(getTree(processId, selectedPhaseTabId, selectedTreeItemId));
  }

  const isTask = element.type === "task"
  const isObjective = element.type === "objective"
  const isPhase = element.type === "phase"

  const taskPermissions = element.permissions.filter(permission => permission.treeitem_id === element.id)
  const objectivePermissions = element.permissions.filter(permission => permission.treeitem_id === element.objective_id)
  const phasePermissions = element.permissions.filter(permission => permission.treeitem_id === (isPhase ? element.id : element.phase_id))

  const colSpan = 8
  return <>
    {selectedTeam && <TeamProfile teamId={selectedTeam} open={true} setOpen={setSelectedTeam} />}
    <Table aria-label="admins-table" size="small">
      <TableHead>
        <TableRow>
          <TableCell align="center"><>{t("Team")}</></TableCell>
          <TableCell align="center"><>{t("Affects you")}</></TableCell>
          <TableCell align="center"><>{t("View resources")}</></TableCell>
          <TableCell align="center"><>{t("Create resources")}</></TableCell>
          <TableCell align="center"><>{t("Delete resources")}</></TableCell>
          <TableCell align="center"><>{t("Update tree items")}</></TableCell>
          <TableCell align="center"><>{t("Delete tree items")}</></TableCell>
          <TableCell align="center"><>{t("Actions")}</></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>

        <TableRow>
          <TableCell align="center" colSpan={colSpan}>
            {t("Permissions for the phase")}
          </TableCell>
        </TableRow>
        {phasePermissions.length > 0 ? phasePermissions.map((permission) => (
          <PermissionRow key={permission.id} language={language} setSelectedTeam={setSelectedTeam} permission={permission} />
        )) : <TableRow>
          <TableCell align="center" colSpan={colSpan}>
            <Alert severity="info">{t("No permissions found")}</Alert>
          </TableCell>
        </TableRow>
        }

        {(isObjective || isTask) && <>
          <TableRow>
            <TableCell align="center" colSpan={colSpan}>
              {t("Permissions for the objective")}
            </TableCell>
          </TableRow>
          {objectivePermissions.length > 0 ? objectivePermissions.map((permission) => (
            <PermissionRow key={permission.id} language={language} setSelectedTeam={setSelectedTeam} permission={permission} />
          )) : <TableRow>
            <TableCell align="center" colSpan={colSpan}>
              <Alert severity="info">{t("No permissions found")}</Alert>
            </TableCell>
          </TableRow>
          }
        </>}
        {isTask && <>
          <TableRow>
            <TableCell align="center" colSpan={colSpan}>
              {t("Permissions for the task")}
            </TableCell>
          </TableRow>
          {taskPermissions.length > 0 ? taskPermissions.map((permission) => (
            <PermissionRow key={permission.id} language={language} setSelectedTeam={setSelectedTeam} permission={permission} />
          )) : <TableRow>
            <TableCell align="center" colSpan={colSpan}>
              <Alert severity="info">{t("No permissions found")}</Alert>
            </TableCell>
          </TableRow>
          }
        </>}

        <TableRow sx={{ mt: 2 }}>
          <TableCell align="center" colSpan={colSpan}>
            {t("Final permissions for you")} {isAdministrator && `(${t("as administrator")})`}
          </TableCell>
        </TableRow>
        <TableRow hover>
          <TableCell align="center">
          </TableCell>
          <TableCell align="center">
          </TableCell>
          <TableCell align="center">
            {element.user_permissions_dict.access_assets_permission && <CheckOutlined />}
          </TableCell>
          <TableCell align="center">
            {element.user_permissions_dict.create_assets_permission && <CheckOutlined />}
          </TableCell>
          <TableCell align="center">
            {element.user_permissions_dict.delete_assets_permission && <CheckOutlined />}
          </TableCell>
          <TableCell align="center">
            {element.user_permissions_dict.edit_treeitem_permission && <CheckOutlined />}
          </TableCell>
          <TableCell align="center">
            {element.user_permissions_dict.delete_treeitem_permission && <CheckOutlined />}
          </TableCell>
          <TableCell align="center">
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <Button sx={{ mt: 2 }} onClick={() => setOpenPermissionCreator(true)} fullWidth variant="contained">{t("Add new permission to the") + " " + treeitem_translations[element.type]}</Button>
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

export default PermissionsTable