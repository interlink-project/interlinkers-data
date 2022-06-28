import { Alert, AppBar, Avatar, Button, Card, CardActions, CardHeader, Grid, List, ListItem, Typography } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import useDependantTranslation from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import TeamProfile from 'pages/dashboard/organizations/TeamProfile';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { getProcess, setSelectedTreeItem, setSelectedTreeItemById } from 'slices/process';
import { groupListBy } from 'utils/groupListBy';
import PermissionCreate from './PermissionCreate';

export default function TeamsTab() {
    const { process, treeitems } = useSelector((state) => state.process);
    const dispatch = useDispatch();
    const mounted = useMounted();
    const { t } = useDependantTranslation()
    const [selectedTeam, setSelectedTeam] = React.useState(null)
    const [permissionCreatorOpen, setOpenPermissionCreator] = React.useState(false);
    const [creatingPermission, setCreatingPermission] = React.useState(false);
    const navigate = useNavigate()

    const update = () => {
        dispatch(getProcess(process.id, false));
    }
    const permissions_grouped = groupListBy(process.permissions, "team_id")

    return <>
        <AppBar sx={{ position: 'relative' }}>
            <Typography variant="h6" sx={{ p: 2 }}>
                {t("Coproduction process team")}
            </Typography>
        </AppBar>
        {selectedTeam && <TeamProfile teamId={selectedTeam} open={selectedTeam ? true : false} setOpen={setSelectedTeam} onChanges={() => console.log("refresh")} />}
        {process.teams.length > 0 ? <>
            <Grid container spacing={3} sx={{ p: 3 }}>

                {process.teams.map(team => <Grid item key={team.id} xs={6} md={6} lg={4} xl={4} sx={{ textAlign: "center" }}>
                    <Card sx={{ p: 1 }}>
                        <CardHeader
                            avatar={
                                <Avatar src={team.logotype_link} />
                            }
                            title={team.name}
                            subheader={team.description}
                            action={<Button onClick={() => setSelectedTeam(team.id)}>{t("See profile")}</Button>}
                        />
                        <List>
                            {permissions_grouped[team.id].map(permission => {
                                const treeitem = treeitems.find(el => el.id === permission.treeitem_id)
                                return <ListItem>
                                    <Button variant="text" fullWidth onClick={() => {
                                        dispatch(setSelectedTreeItem(treeitem, () =>  navigate(`/dashboard/coproductionprocesses/${process.id}/guide`)))
                                    
                                    }}>
                                        {treeitem.name}
                                    </Button>
                                </ListItem>
                            })}
                        </List>

                    </Card>
                </Grid>
                )}

            </Grid>
        </> : <>
            <Alert severity='warning' sx={{p: 3, m: 3}}>
                {t("There are no teams working on the coproduction process yet. To add a new team, navigate to the guide section, select a tree item and add a new permission.")}
            </Alert></>}

        <PermissionCreate
            open={permissionCreatorOpen}
            setOpen={setOpenPermissionCreator}
            onCreate={update}
            loading={creatingPermission}
            setLoading={setCreatingPermission}
            coproductionprocess={process}
        />
        <div className={"flex-grow"} />
        <CardActions>
            {false && <LoadingButton loading={creatingPermission} variant="contained" fullWidth onClick={() => setOpenPermissionCreator(true)}>{t("Create new permission")}</LoadingButton>}

        </CardActions>
    </>
}