import { Avatar, Link, Skeleton, Stack } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";
import { interlinkersApi } from '__api__';


const InterlinkerReference = ({ interlinker_id, onClick = () => {} }) => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(null)

    useEffect(() => {
        interlinkersApi.get(interlinker_id).then((res) => {
            setData(res)
            setLoading(false)
        })
    }, [])

    return loading || !data ? <Skeleton /> : <Stack direction="row" alignItems="center" spacing={1}>
        {data.logotype_link && <Avatar src={data.logotype_link} sx={{ height: "20px", width: "20px" }} />}
        <Link
            color='primary'
            onClick={onClick}
            underline='none'
        >
            {data.name}
        </Link>
    </Stack>
}

export default InterlinkerReference