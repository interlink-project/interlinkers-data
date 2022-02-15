import { Avatar, Divider, Select, AvatarGroup, Paper, Table, TableCell, TableContainer, TableHead, TableRow, TableBody, IconButton, Typography, Collapse, Box, MenuItem, CircularProgress } from '@material-ui/core';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PermissionsTable from './PermissionsTable';
import TeamsTable from './TeamsTable';
import { aclsApi } from '__fakeApi__';

export default function TeamsTab() {
    const { process, updating } = useSelector((state) => state.process);
    const [loading, setLoading] = React.useState(false)
    const [acl, setAcl] = React.useState(null)

    const updateAcl = async () => {
        const acl = await aclsApi.get(process.acl_id);
        setAcl(acl)
        setLoading(false)
    }

    React.useEffect(() => {
        if (process.acl_id) {
            setLoading(true)
            updateAcl()
        }
    }, [process])

    return acl ? (
        <React.Fragment>
            <TeamsTable acl={acl} onChanges={updateAcl} />
            <Divider sx={{ my: 2 }} />
            <PermissionsTable acl={acl} onChanges={updateAcl} />
        </React.Fragment>) : <CircularProgress />
        ;
}