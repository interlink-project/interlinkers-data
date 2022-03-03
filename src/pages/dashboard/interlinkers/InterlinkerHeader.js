import { Avatar, Button, Chip, Stack, Typography } from '@material-ui/core';
import { Share } from '@material-ui/icons';


const InterlinkerHeader = ({ interlinker }) => {

    const isSoftware = interlinker.nature === "softwareinterlinker"
    const isOfficial = !interlinker.creator_id

    return <>
        <Stack direction='row' style={{ justifyContent: "center", alignItems: "center", }} sx={{ pt: 1 }} spacing={3}>
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
        </Stack>
        <Stack direction='row' style={{ justifyContent: "center", alignItems: "center", }} sx={{ pb: 1 }} spacing={2}>
            <Chip label={isOfficial ? "Official" : "Community"} color={isOfficial ? "success" : "warning"} size="small" />
            <Chip label={isSoftware ? "Software" : "Knowledge"} color={isSoftware ? "primary" : "secondary"} size="small" />
            <Button
                color='primary'
                startIcon={<Share fontSize='small' />}
                variant='text'
            >
                Share
            </Button>
        </Stack>
    </>
}

export default InterlinkerHeader