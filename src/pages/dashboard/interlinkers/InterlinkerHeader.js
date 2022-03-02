import { Avatar, Button, Stack, Typography } from '@material-ui/core';
import { Share } from '@material-ui/icons';


const InterlinkerHeader = ({ interlinker }) => <Stack direction='row' style={{ justifyContent: "center", alignItems: "center", }} sx={{ py: 1 }} spacing={3}>
    {interlinker.logotype && <Avatar
        alt='Logotype'
        src={interlinker.logotype}
        variant='square'
    >
        {interlinker.name}
    </Avatar>}

    <Typography
        color='textPrimary'
        variant='h5'
    >
        {interlinker.name}
    </Typography>
    <Button
        color='primary'
        startIcon={<Share fontSize='small' />}
        variant='text'
    >
        Share
    </Button>
</Stack>

export default InterlinkerHeader