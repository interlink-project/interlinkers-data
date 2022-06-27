import { AppBar, Box, Paper, Tab, Tabs, Typography } from '@material-ui/core';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import NoAdmins from './NoAdmins';
import TimeLine from './TimeLine';


export default function Overview({ }) {
    const { process, isAdministrator, tree } = useSelector((state) => state.process);
    const t = useCustomTranslation(process.language)
    const [tab, setTab] = useState(isAdministrator ? "progress" : "assets")

    if (!process || !tree) {
        return
    }

    return <Box sx={{ pb: 3, justifyContent: "center" }}>
        
        <AppBar sx={{ position: 'relative' }}>
            <Typography variant="h6" sx={{ p: 2 }}>
                {t("Coproduction process overview")}
            </Typography>
        </AppBar>
        {isAdministrator && <Paper sx={{ bgcolor: "background.default" }}>
            <Tabs
                value={tab}
                onChange={(event, newValue) => {
                    setTab(newValue);
                }}
                aria-label="overview-tabs"
                centered
            >
                <Tab value="progress" label={t("Progress")} />
                <Tab value="assets" label={t("Resources")} />
            </Tabs>
        </Paper>}
        {tab === "progress" ?
            <TimeLine />
            :
            <NoAdmins />
        }
    </Box>
}