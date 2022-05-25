import {
    Box, Button, CircularProgress, Grid, Typography
} from '@material-ui/core';
import {
    useCustomTranslation
} from 'hooks/useDependantTranslation';
import { getLanguage } from 'translations/i18n';

const CentricCircularProgress = ({ language = getLanguage(), text = "", onCancel = null }) => {
    const t = useCustomTranslation(language)
    return (
        <Box
            style={{
                position: 'absolute', left: '50%', top: '50%',
                transform: 'translate(-50%, -50%)'
            }}
        >
            <Grid container justifyContent="center" style={{ textAlign: "center" }}>
                <Grid item xs={12}>
                    <Typography variant="h5">
                        {text}
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{ mt: 3 }}>
                    <CircularProgress />
                </Grid>
                {onCancel && <Grid item xs={12} sx={{ mt: 3 }}>
                    <Button color="error" onClick={onCancel}>
                        {t("Cancel")}
                    </Button>
                </Grid>}

            </Grid>
        </Box>
    )
}

export default CentricCircularProgress