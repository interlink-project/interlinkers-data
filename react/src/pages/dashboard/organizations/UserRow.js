import { Avatar, Skeleton, TableCell, TableRow } from '@material-ui/core';
import useAuth from 'hooks/useAuth';
import useMounted from 'hooks/useMounted';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { usersApi } from '__api__';


const UserRow = ({ t, user, actions }) => {
    const { user: auth_user } = useAuth();
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(null)
    const mounted = useMounted();


    useEffect(() => {
        setData(user)
        return
        setLoading(true)
        usersApi.get(user.id).then(res => {
            if (mounted.current) {
                setData(res.data)
                setLoading(false)
            }
        })
    }, [user])

    const you = user.id === auth_user.sub

    return <TableRow
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
        {!data ? <>
            <TableCell component="th" scope="row" colSpan={5}>
                <Skeleton />
            </TableCell>
        </> : <>
            <TableCell component="th" scope="row">
                <Avatar src={data.picture} />
            </TableCell>
            <TableCell>{data.full_name}{you && <> ({t("you")})</>}</TableCell>
            <TableCell>{data.email}</TableCell>
            <TableCell>{moment(data.last_login).fromNow()}</TableCell>
            <TableCell>
                {actions}
            </TableCell>
        </>}
    </TableRow>
}

export default UserRow;
