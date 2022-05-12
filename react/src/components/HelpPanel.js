import { Box, Drawer, Fab, IconButton, Typography } from '@material-ui/core';
import { Close, Help } from '@material-ui/icons';
import useSettings from 'hooks/useSettings';

const helps = {
    "/dashboard": {
        url: "https://interlink-project.github.io/interlink-project/usermanual/dashboard.html"
    },
    "/dashboard/interlinkers": {
        url: "https://interlink-project.github.io/interlink-project/usermanual/catalogue-interlinkers.html"
    },
    "/dashboard/interlinkers/(.+)": {
        url: "https://interlink-project.github.io/interlink-project/usermanual/catalogue-interlinker-profile.html"
    },
    "/dashboard/coproductionprocesses/(.+)/overview": {
        url: "https://interlink-project.github.io/interlink-project/usermanual/coproductionprocess-overview.html"
    },
    "/dashboard/coproductionprocesses/(.+)/guide": {
        url: "https://interlink-project.github.io/interlink-project/usermanual/coproductionprocess-guide.html"
    },
    "/dashboard/coproductionprocesses/(.+)/workplan": {
        url: "https://interlink-project.github.io/interlink-project/usermanual/coproductionprocess-workplan.html"
    },
    "/dashboard/coproductionprocesses/(.+)/settings": {
        url: "https://interlink-project.github.io/interlink-project/usermanual/coproductionprocess-settings.html"
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

    if (!settings.showHelp) {
        return <></>
    }

    let helpData
    Object.keys(helps).forEach(element => {
        const match = location.pathname.match(element)
        if (match) {
            helpData = helps[element]
        }
    });

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
                    {helpData ? <iframe style={{ position: "absolute", height: "100%", width: "100%", border: "none" }} src={helpData.url} /> : <Typography>
                        No help found for {location.pathname}
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
            Need help?
        </Fab>
        }
    </>
}

export default HelpPanel;
