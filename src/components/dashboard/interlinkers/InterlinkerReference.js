import { Avatar, Link, Stack } from '@material-ui/core';
import { Link as RouterLink } from "react-router-dom";


const InterlinkerReference = ({ interlinker }) => <Stack direction="row" alignItems="center" spacing={1}>
    <Avatar src={interlinker.logotype_link} sx={{ height: "20px", width: "20px" }} />
    <Link
        color='primary'
        component={RouterLink}
        to={''}
        underline='none'
    >
        {interlinker.name}
    </Link>
</Stack>

export default InterlinkerReference