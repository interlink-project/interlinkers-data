import { Box, CardHeader, Drawer, Fab, IconButton, Paper, Typography } from '@material-ui/core';
import { Close, Help } from '@material-ui/icons';
import useSettings from 'hooks/useSettings';

const helps = {
    "/dashboard": {
        title: "Workspace",
        content: <>
        </>
    },
    "/dashboard/interlinkers": {
        title: "Interlinkers catalogue help",
        content: <>
            <img src="/static/help/catalogue-1.png" style={{ height: "auto", width: "100%" }} />
            <Typography sx={{ my: 3 }}>
                On this page you can view, filter and preview existing interlinkers. To view the profile of an interlinker, click on its name.
            </Typography>
            <img src="/static/help/catalogue-2.png" style={{ height: "auto", width: "100%" }} />

        </>
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
    const helpData = helps[location.pathname]

    return <>

        <Drawer
            anchor="right"
            open={settings.helpOpen}
            onClose={() => saveSettings({ helpOpen: false })}

        >
            <Box sx={{ width: "40vw" }}>
                <CardHeader
                    avatar={
                        <Help />
                    }
                    action={
                        <IconButton aria-label="help" onClick={() => saveSettings({ helpOpen: false })}>
                            <Close />
                        </IconButton>
                    }
                    title={helpData ? helpData.title : location.pathname}
                />
                <Box sx={{ m: 3 }}>
                    {helpData ? helpData.content : <Typography>
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
