import { Avatar, Chip, Skeleton, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { People } from '@material-ui/icons';
import { OrganizationChip } from 'components/dashboard/assets/Icons';
import useDependantTranslation from 'hooks/useDependantTranslation';
import moment from 'moment';


const TeamsList = ({ organization, teams, loadingTeams, onTeamClick = null }) => {
    const { t } = useDependantTranslation()

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell align="center">{t("Name")}</TableCell>
                    <TableCell align="center">{t("Type")}</TableCell>
                    <TableCell align="center">{t("Created")}</TableCell>
                    <TableCell align="center">{t("Members")}</TableCell>
                    <TableCell align="center">{t("Your participation in the team")}</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {teams && teams.map((team) => (
                    <TableRow sx={{ cursor: onTeamClick ? 'pointer' : '' }} key={team.id} onClick={() => onTeamClick(team)} hover={onTeamClick !== null}>
                        <TableCell align="center">
                            <Stack alignItems="center" direction="row" spacing={1}>
                                {team.logotype_link ? <Avatar sx={{ height: "25px", width: "25px" }} variant="rounded" src={team.logotype_link} /> : <People />}
                                <b>{team.name}</b>
                            </Stack>
                        </TableCell>
                        <TableCell align="center" component="th" scope="row">
                            <OrganizationChip type={team.type} />
                        </TableCell>
                        <TableCell align="center">{moment(team.created_at).fromNow()}</TableCell>
                        <TableCell align="center">
                            {team.users_count}
                        </TableCell>
                        <TableCell align="center">
                            {team.current_user_participation.length > 0 ? team.current_user_participation.map(p => <Chip size="small" sx={{ mr: 1 }} key={team.id + p} title={`You are ${p} of the organization`} variant={p === "administrator" ? "contained" : "outlined"} label={p} />) : <Chip label={t("None")} />}
                        </TableCell>
                    </TableRow>
                ))}
                {loadingTeams && [...Array(organization.teams_ids.length).keys()].map((i) => <TableRow key={`skeleton-${i}`}>
                    <TableCell align="center" colSpan={6}>
                        <Skeleton />
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

export default TeamsList;
