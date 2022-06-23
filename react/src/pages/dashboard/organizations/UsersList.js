import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import UserSearch from '../coproductionprocesses/Tabs/Team/UserSearch';
import UserRow from './UserRow';


const UsersList = ({ users, searchOnOrganization = null, onSearchResultClick = null, getActions = null, disableContainer = true, disableHeader = true, showLastLogin = true}) => {
    const { t } = useTranslation()
    const table = <Table>
        {!disableHeader && <TableHead>
            <TableRow>
                <TableCell align="center"></TableCell>
                <TableCell align="center">{t("Name")}</TableCell>
                <TableCell align="center">{t("Email")}</TableCell>
                {showLastLogin && <TableCell align="center">{t("Last login")}</TableCell>}
                {getActions && <TableCell align="center"></TableCell>}
            </TableRow>
        </TableHead>}
        <TableBody>
            {users.length > 0 && users.map((user) => <UserRow key={user.id} user={user} t={t} actions={getActions && getActions(user)} showLastLogin={showLastLogin}/>)}
        </TableBody>
    </Table>

    return <>
        {!disableContainer ? <TableContainer component={Paper}>
            {table}
        </TableContainer> : table}
        {onSearchResultClick && <UserSearch exclude={users.map(user => user.id)} organization_id={searchOnOrganization} onClick={onSearchResultClick} />}
    </>
};

export default UsersList;
