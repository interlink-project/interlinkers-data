import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import UserSearch from '../coproductionprocesses/Tabs/Team/UserSearch';
import UserRow from './UserRow';


const UsersList = ({ users, searchOnOrganization = null, onSearchResultClick = null, getActions, useContainer = true, useHeader = true }) => {
    const { t } = useTranslation()
    const table = <Table>
        {useHeader && <TableHead>
            <TableRow>
                <TableCell align="center"></TableCell>
                <TableCell align="center">{t("Name")}</TableCell>
                <TableCell align="center">{t("Email")}</TableCell>
                <TableCell align="center">{t("Last login")}</TableCell>
                <TableCell align="center"></TableCell>
            </TableRow>
        </TableHead>}
        <TableBody>
            {users.length > 0 && users.map((user) => <UserRow key={user.id} user={user} t={t} actions={getActions(user)} />)}
        </TableBody>
    </Table>

    return <>
        {useContainer ? <TableContainer component={Paper}>
            {table}
        </TableContainer> : table}
        {searchOnOrganization && onSearchResultClick && <UserSearch exclude={users.map(user => user.id)} organization_id={searchOnOrganization} onClick={onSearchResultClick} />}
    </>
};

export default UsersList;
