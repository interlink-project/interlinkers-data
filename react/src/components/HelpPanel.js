import { Box, Drawer, Fab, Typography } from '@material-ui/core';
import { Help } from '@material-ui/icons';
import useSettings from 'hooks/useSettings';
import { useTranslation } from 'react-i18next';
import { getLanguage } from 'translations/i18n';

const helps = {
    "/dashboard": {
        url: (language) => `https://dev.interlink-project.eu/docs/${language}/usermanual/dashboard.html`,
    },
    "/dashboard/interlinkers": {
        url: (language) => `https://dev.interlink-project.eu/docs/${language}/usermanual/catalogue-interlinkers.html`,
    },
    "/dashboard/interlinkers/(.+)": {
        url: (language) => `https://dev.interlink-project.eu/docs/${language}/usermanual/catalogue-interlinker-profile.html`,
    },
    "/dashboard/coproductionprocesses/(.+)/overview": {
        url: (language) => `https://dev.interlink-project.eu/docs/${language}/usermanual/coproductionprocess-overview.html`,
    },
    "/dashboard/coproductionprocesses/(.+)/activity": {
        url: (language) => `https://dev.interlink-project.eu/docs/${language}/usermanual/coproductionprocess-activity.html`,
    },
    "/dashboard/coproductionprocesses/(.+)/guide": {
        url: (language) => `https://dev.interlink-project.eu/docs/${language}/usermanual/coproductionprocess-guide.html`,
    },
    "/dashboard/coproductionprocesses/(.+)/workplan": {
        url: (language) => `https://dev.interlink-project.eu/docs/${language}/usermanual/coproductionprocess-workplan.html`,
    },
    "/dashboard/coproductionprocesses/(.+)/team": {
        url: (language) => `https://dev.interlink-project.eu/docs/${language}/usermanual/coproductionprocess-team.html`,
    },
    "/dashboard/coproductionprocesses/(.+)/settings": {
        url: (language) => `https://dev.interlink-project.eu/docs/${language}/usermanual/coproductionprocess-settings.html`,
    }
}

/* 
                {helpData && <Fade in={true}>
                    <Card style={{
                        position: "fixed",
                        bottom: 30,
                        right: 30,
                        zIndex: 90,
                        minWidth: "400px",
                        height: "50vh",
                        minHeight: "400px"
                    }} elevation={24} >
                        
                    </Card>
                </Fade>
                */
const HelpPanel = () => {
    const { settings, saveSettings } = useSettings();
    const { t } = useTranslation()

    if (!settings.showHelp) {
        return <></>
    }

    let helpData
    Object.keys(helps).forEach(path => {
        const match = location.pathname.match(path)
        if (match) {
            helpData = helps[path]
        }
    });
    const language = getLanguage()
    return <>

        <Drawer
            anchor="right"
            open={settings.helpOpen}
            onClose={() => saveSettings({ helpOpen: false })}
        >
            <Box sx={{ width: "40vw" }}>
                {/* <IconButton sx={{ position: "absolute", top: 0, right: 0, zIndex: 91 }} aria-label="help" onClick={() => saveSettings({ helpOpen: false })}>
                    <Close />
                </IconButton> */}

                <Box>
                    {helpData ? <iframe style={{ position: "absolute", height: "100%", width: "100%", border: "none" }} src={helpData.url(language)} /> : <Typography>
                        {t("No help found for", { what: location.pathname })}
                    </Typography>}
                </Box>

            </Box>
        </Drawer>


        {!settings.helpOpen && <Fab sx={{
            margin: 0,
            top: 'auto',
            right: 30,
            bottom: 30,
            left: 'auto',
            position: 'fixed',
        }} color="primary" variant="extended" onClick={() => saveSettings({ helpOpen: true })}>
            <Help sx={{ mr: 1 }} />
            {t("Need help?")}
        </Fab>
        }
    </>
}

export default HelpPanel;
