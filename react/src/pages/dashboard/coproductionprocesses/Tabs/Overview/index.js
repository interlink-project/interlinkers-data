import { AppBar, Box, Typography } from '@material-ui/core';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import { useSelector } from 'react-redux';
import NoAdmins from './NoAdmins';
import TimeLine from './TimeLine';


export default function Overview({ }) {
    const { process, isAdministrator, tree } = useSelector((state) => state.process);
    const t = useCustomTranslation(process.language)

    if (!process || !tree) {
        return
    }

    return <Box sx={{ pb: 3, justifyContent: "center" }}>

        <AppBar sx={{ position: 'relative' }}>
            <Typography variant="h6" sx={{ p: 2 }}>
                {t("Coproduction process overview")}
            </Typography>
        </AppBar>
        {false ?
            <TimeLine />
            :
            <NoAdmins />
        }
    </Box>
}