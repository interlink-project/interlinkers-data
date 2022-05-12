import {
    Avatar, CircularProgress
} from '@material-ui/core';
import useMounted from 'hooks/useMounted';
import React, { useEffect, useState } from 'react';
import { usersApi } from "__api__";

const UserData = ({ variant, id, sx = {} }) => {
    const mounted = useMounted();
    const [data, setData] = useState(null)
    useEffect(() => {
        usersApi.get(id).then(res => {
            if (mounted.current) {
                setData(res.data)
            }
        })
    }, [id])
    return <React.Fragment key={id}>{data ? <Avatar title={data.email} src={data.picture} sx={sx} /> : <CircularProgress sx={sx} />}</React.Fragment>
}
export default UserData;
