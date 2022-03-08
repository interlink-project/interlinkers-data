import { Avatar, Button, Chip, Stack, Typography } from '@material-ui/core';
import { Share } from '@material-ui/icons';


const InterlinkerHeader = ({ interlinker }) => {

    return <Stack direction='row' style={{ justifyContent: "center", alignItems: "center", }} sx={{ pt: 1 }} spacing={3}>
            {interlinker.logotype_link && <Avatar
                alt='Logotype'
                src={interlinker.logotype_link}
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
}

export default InterlinkerHeader