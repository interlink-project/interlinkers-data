import {
  Alert, Avatar, Button, IconButton, Stack, Switch, Table, TableBody, TableCell, TableHead, TableRow, Typography
} from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import { CheckOutlined, Close, Delete } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import ConfirmationButton from 'components/ConfirmationButton';
import { user_id } from 'contexts/CookieContext';
import useAuth from 'hooks/useAuth';
import useDependantTranslation, { useCustomTranslation } from 'hooks/useDependantTranslation';
import PermissionCreate from 'pages/dashboard/coproductionprocesses/Tabs/Team/PermissionCreate';
import TeamProfile from 'pages/dashboard/organizations/TeamProfile';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getTree } from 'slices/process';
import { tree_items_translations } from 'utils/someCommonTranslations';

const PermissionRow = ({ permission, showOnlyMine, setSelectedTeam, userIsAdmin = false, admin = false }) => {
  const { user } = useAuth()
  const { t } = useDependantTranslation()

  const handleDelete = () => {
    console.log("DELETE", permission.id)
  }

  return <TableRow hover>
    <TableCell align="center">
      {!admin && userIsAdmin && <ConfirmationButton
        key={`${permission.id}-delete-action`}
        Actionator={({ onClick }) => <IconButton onClick={onClick}>
          <Delete />
        </IconButton>}
        ButtonComponent={({ onClick }) => <LoadingButton sx={{ mt: 1 }} fullWidth variant='contained' color="error" onClick={onClick}>{t("Confirm deletion")}</LoadingButton>}
        onClick={handleDelete}
        text={t("Are you sure?")} />}

    </TableCell>

    {!showOnlyMine && <TableCell align="center">
      {!admin && <>{permission.user_id == user_id || user.teams_ids.includes(permission.team_id) ? <CheckOutlined style={{ color: green[500] }} /> : <Close style={{ color: red[500] }} />}</>}
    </TableCell>}
    <TableCell align="center">
      {!admin && <Button size="small" startIcon={<Avatar src={permission.team.logotype_link} />} onClick={() => setSelectedTeam(permission.team_id)} variant="contained">{permission.team && permission.team.name} {t("team")}</Button>}
    </TableCell>
    <TableCell align="center">
      {admin || permission.access_assets_permission ? <CheckOutlined style={{ color: green[500] }} /> : <Close style={{ color: red[500] }} />}
    </TableCell>
    <TableCell align="center">
      {admin || permission.create_assets_permission ? <CheckOutlined style={{ color: green[500] }} /> : <Close style={{ color: red[500] }} />}
    </TableCell>
    <TableCell align="center">
      {admin || permission.delete_assets_permission ? <CheckOutlined style={{ color: green[500] }} /> : <Close style={{ color: red[500] }} />}
    </TableCell>
    <TableCell align="center">
      {admin || permission.edit_treeitem_permission ? <CheckOutlined style={{ color: green[500] }} /> : <Close style={{ color: red[500] }} />}
    </TableCell>
    <TableCell align="center">
      {admin || permission.delete_treeitem_permission ? <CheckOutlined style={{ color: green[500] }} /> : <Close style={{ color: red[500] }} />}
    </TableCell>

  </TableRow>
}

const PermissionsTable = ({ language, processId, element, isAdministrator }) => {
  const [permissions, setPermissions] = React.useState([])
  const [selectedTeam, setSelectedTeam] = React.useState(null);
  const [showOnlyMine, _setShowOnlyMine] = React.useState(!isAdministrator);
  const {user} = useAuth()

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

  const taskPermissions = permissions.filter(permission => permission.treeitem_id === element.id)
  const objectivePermissions = permissions.filter(permission => permission.treeitem_id === (isObjective ? element.id : element.objective_id))
  const phasePermissions = permissions.filter(permission => permission.treeitem_id === (isPhase ? element.id : element.phase_id))

  useEffect(() => {
    setPermissions(element.permissions)
  }, [element])

  const setShowOnlyMine = (val) => {
    if(val){
      setPermissions(
        element.permissions.filter(permission => permission.user_id == user_id || user.teams_ids.includes(permission.team_id))
      )
    }else{
      setPermissions(
        element.permissions
      )
    }
    _setShowOnlyMine(val)
  }

  const colSpan = 8
  return <>
    {selectedTeam && <TeamProfile teamId={selectedTeam} open={true} setOpen={setSelectedTeam} />}
    {!isAdministrator && <Alert severity="info" action={<Switch checked={showOnlyMine} onChange={(event) => setShowOnlyMine(event.target.checked)} />}>{t("Show the sum of the permissions that affect me")}</Alert>}

    <Table aria-label="admins-table" size="small">
      <TableHead>
        <TableRow>
          <TableCell align="center"><>{t("Actions")}</></TableCell>
          {!showOnlyMine && <TableCell align="center"><>{t("Affects you")}       </></TableCell>}
          <TableCell align="center"><>{t("Team")}</></TableCell>
          <TableCell align="center"><>{t("View resources")}</></TableCell>
          <TableCell align="center"><>{t("Create resources")}</></TableCell>
          <TableCell align="center"><>{t("Delete resources")}</></TableCell>
          <TableCell align="center"><>{t("Update tree items")}</></TableCell>
          <TableCell align="center"><>{t("Delete tree items")}</></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>


        <TableRow>
          <TableCell align="center" colSpan={colSpan}>
            <Typography variant="subtitle2" sx={{ my: 1, bgcolor: "background.default" }}>
              {t("Permissions for the phase")} ({phasePermissions.length})
            </Typography>
          </TableCell>
        </TableRow>
        {phasePermissions.length > 0 && phasePermissions.map((permission) => (
          <PermissionRow showOnlyMine={showOnlyMine} key={permission.id} setSelectedTeam={setSelectedTeam} permission={permission} />
        ))}
        {(isObjective || isTask) && <>
          <TableRow>
            <TableCell align="center" colSpan={colSpan}>
              <Typography variant="subtitle2" sx={{ my: 1, bgcolor: "background.default" }}>
                {t("Permissions for the objective")} ({objectivePermissions.length})
              </Typography>
            </TableCell>
          </TableRow>
          {objectivePermissions.length > 0 && objectivePermissions.map((permission) => (
            <PermissionRow showOnlyMine={showOnlyMine} key={permission.id} setSelectedTeam={setSelectedTeam} permission={permission} />
          ))}
        </>}
        {isTask && <>
          <TableRow>
            <TableCell align="center" colSpan={colSpan}>
              <Typography variant="subtitle2" sx={{ my: 1, bgcolor: "background.default" }}>
                {t("Permissions for the task")} ({taskPermissions.length})
              </Typography>
            </TableCell>
          </TableRow>
          {taskPermissions.length > 0 && taskPermissions.map((permission) => (
            <PermissionRow showOnlyMine={showOnlyMine} key={permission.id} setSelectedTeam={setSelectedTeam} permission={permission} />
          ))}
        </>}

        {showOnlyMine && <>
          {isAdministrator && <>
            <TableRow>
              <TableCell align="center" colSpan={colSpan}>
                <Typography variant="subtitle2" sx={{ my: 1 }}>
                  {t("Permissions as administrator")}
                </Typography>
              </TableCell>
            </TableRow>
            <PermissionRow setSelectedTeam={setSelectedTeam} admin />
          </>}
          <TableRow>
            <TableCell align="center" colSpan={colSpan}>
              <Typography variant="subtitle2" sx={{ my: 1, fontWeight: "bold"}}>
                {t("Final permissions for you")}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow hover>
            <TableCell align="center">
            </TableCell>
            <TableCell align="center">
            </TableCell>
            <TableCell align="center">
            </TableCell>
            <TableCell align="center">
              {element.user_permissions_dict.access_assets_permission ? <CheckOutlined style={{ color: green[500] }} /> : <Close style={{ color: red[500] }} />}
            </TableCell>
            <TableCell align="center">
              {element.user_permissions_dict.create_assets_permission ? <CheckOutlined style={{ color: green[500] }} /> : <Close style={{ color: red[500] }} />}
            </TableCell>
            <TableCell align="center">
              {element.user_permissions_dict.delete_assets_permission ? <CheckOutlined style={{ color: green[500] }} /> : <Close style={{ color: red[500] }} />}
            </TableCell>
            <TableCell align="center">
              {element.user_permissions_dict.edit_treeitem_permission ? <CheckOutlined style={{ color: green[500] }} /> : <Close style={{ color: red[500] }} />}
            </TableCell>
            <TableCell align="center">
              {element.user_permissions_dict.delete_treeitem_permission ? <CheckOutlined style={{ color: green[500] }} /> : <Close style={{ color: red[500] }} />}
            </TableCell>

          </TableRow>
        </>}
      </TableBody>
    </Table>
    {isAdministrator && !showOnlyMine && <Button sx={{ mt: 2 }} onClick={() => setOpenPermissionCreator(true)} fullWidth variant="contained">{t("Add new permission to the") + " " + treeitem_translations[element.type]}</Button>}
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