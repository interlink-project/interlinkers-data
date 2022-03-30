import {
    Avatar, CircularProgress
} from '@material-ui/core';
import useMounted from 'hooks/useMounted';
import { useEffect, useState } from 'react';
import { usersApi } from "__fakeApi__";

const UserData = ({ variant, id, sx = {}}) => {
    const mounted = useMounted();
    const [data, setData] = useState(null)
    useEffect(() => {
        usersApi.get(id).then(res => {
            if (mounted) {
                setData(res.data)
            }
        })
    }, [id])
    return data ? <Avatar title={data.email} key={id} src={data.picture} sx={sx} /> : <CircularProgress sx={sx} key={id} />
}
export default UserData;
