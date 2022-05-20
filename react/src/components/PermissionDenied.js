
import { Box, Typography } from '@material-ui/core';
import { Error } from '@material-ui/icons';
import PropTypes from 'prop-types';
import useDependantTranslation from 'hooks/useDependantTranslation';


const PermissionDenied = (props) => {
    const { explanation, ...other } = props;
    const { t } = useDependantTranslation()
    
    return (
        <Box
            style={{
                position: 'absolute', left: '50%', top: '50%',
                transform: 'translate(-50%, -50%)'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Error />
            </Box>
            <Box sx={{ mt: 2 }}>
                <Typography
                    align='center'
                    color='textPrimary'
                    variant='h3'
                >
                    {t("you-do-not-have-permission")}
                </Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
                <Typography
                    align='center'
                    color='textSecondary'
                    variant='subtitle1'
                >
                    {explanation}
                </Typography>
            </Box>
        </Box>
    );
};

PermissionDenied.propTypes = {
    explanation: PropTypes.string,
};

export default PermissionDenied;
