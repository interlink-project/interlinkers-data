import { Box, Avatar, Button, Chip, Stack, Typography, Rating } from '@material-ui/core';
import { Share } from '@material-ui/icons';


const InterlinkerHeader = ({ interlinker }) => {

    return <Stack direction="column" sx={{ m: 0 }}>
        <Stack direction='row' style={{ justifyContent: "center", alignItems: "center", }} spacing={2}>
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
            {/* <Button
                color='primary'
                startIcon={<Share fontSize='small' />}
                variant='text'
            >
                Share
            </Button>*/}
        </Stack>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
            <Rating readOnly value={interlinker.rating} />
            <Typography variant="subtitle1">
                ({interlinker.ratings_count})
            </Typography>
        </Stack>
    </Stack>
}

export default InterlinkerHeader