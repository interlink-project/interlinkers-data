import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import SearchBox from 'components/SearchBox';
import React from 'react';
import { useTranslation } from 'react-i18next';
import OrganizationRow from './OrganizationRow';

const OrganizationsList = ({ organizations, searchValue, setSearchValue, loading, getCollapseElement }) => {
    const { t } = useTranslation()
    return (<>
        <Box sx={{ mb: 2 }}>
            <SearchBox loading={loading} inputValue={searchValue} setInputValue={setSearchValue} />
        </Box>
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">{t("Name")}</TableCell>
                        <TableCell align="center">{t("Public")}</TableCell>
                        <TableCell align="center">{t("Administrators")}</TableCell>
                        <TableCell align="center">{t("Created")}</TableCell>
                        <TableCell align="center">{t("Team number")}</TableCell>
                        <TableCell align="center">{t("Your participation in the organization")}</TableCell>
                        <TableCell align="center"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {organizations.length > 0 && organizations.map((organization) => (
                        <React.Fragment key={organization.id} >
                            <OrganizationRow collapseElement={getCollapseElement(organization)} organization={organization} />
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </>
    );
};

export default OrganizationsList;
