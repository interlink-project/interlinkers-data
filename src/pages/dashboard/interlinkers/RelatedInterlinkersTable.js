import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha, Box, Table, Toolbar, Avatar, Typography, Paper, Checkbox, FormControlLabel, IconButton, Tooltip, TableSortLabel, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Rating, Stack } from '@material-ui/core';
import { visuallyHidden } from '@material-ui/utils';
import { Delete, FilterList } from '@material-ui/icons';
import { interlinkersApi } from "__api__"
import useMounted from 'hooks/useMounted';
import { SafeHTMLElement } from 'utils/safeHTML';
import moment from "moment"
import { NatureChip } from 'components/dashboard/assets/Icons';
import { InterlinkerReference } from 'components/dashboard/interlinkers';

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'name',
        label: 'Name',
    },
    {
        id: 'nature',
        label: 'Nature',
    },
    {
        id: 'description',
        label: 'Description',
    },
    {
        id: 'based_on',
        label: 'Based on',
    },
    {
        id: 'created_at',
        label: 'Created at',
    },
    {
        id: 'rating',
        label: 'Rating',
    },
];

function RelatedInterlinkersTableHead(props) {
    const { order, orderBy, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

RelatedInterlinkersTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

export default function RelatedInterlinkersTable({ interlinker }) {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const [interlinkers, setInterlinkers] = React.useState([])
    const [total, setTotal] = React.useState(0)
    const [loading, setLoading] = React.useState(true)
    const mounted = useMounted();

    const getRelatedInterlinkers = React.useCallback(async () => {
        setLoading(true)
        try {
            const data = await interlinkersApi.getRelated(page + 1, rowsPerPage, interlinker.id);
            if (mounted.current) {
                setInterlinkers(data.items);
                setTotal(data.total)
                setLoading(false)
            }
        } catch (err) {
            console.error(err);
        }

    }, [page, mounted]);

    React.useEffect(() => {
        getRelatedInterlinkers()
    }, [])

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = interlinkers.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - total) : 0;

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size='medium'
                    >
                        <RelatedInterlinkersTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={total}
                        />
                        <TableBody>
                            {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
                            {stableSort(interlinkers, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.name);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.id}
                                            selected={isItemSelected}
                                        >
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                            >
                                                <Stack sx={{ alignItems: "center", textAlign: "center" }} spacing={1}>
                                                    {row.logotype_link && <Avatar src={row.logotype_link} sx={{ width: "30px", height: "30px" }} />}
                                                    <Typography variant="subtitle1">
                                                        {row.name}
                                                    </Typography>
                                                </Stack>

                                            </TableCell>
                                            <TableCell><NatureChip nature={row.nature} /></TableCell>
                                            <TableCell>
                                                <SafeHTMLElement data={row.description} />
                                            </TableCell>
                                            <TableCell>
                                                {row.softwareinterlinker_id && <InterlinkerReference interlinker_id={row.softwareinterlinker_id} />}
                                            </TableCell>
                                            <TableCell>{moment(row.created_at).format("LL")}</TableCell>

                                            <TableCell>
                                                <Stack direction="row" alignItems="center">
                                                <Rating readOnly value={row.rating || 0} />
                                                <Typography>({row.ratings_count})</Typography>
                                                </Stack>
                                                
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: 53 * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={total}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

        </Box>
    );
}