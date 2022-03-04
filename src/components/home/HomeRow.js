import { Box, Button, Grid, Grow, Typography } from '@material-ui/core';

const HomeRow = ({ title, text, extra1 = null, extra2 = null, variance = false }) => {

    const First = () => <Grid item xs={12} lg={8}>
        <Typography sx={{ textAlign: "center" }} variant="h4" color={variance && "primary.contrastText"}>
            {title}
        </Typography>
        {text.map(el => <Typography variant="body1" color={variance && "primary.contrastText"} sx={{ fontSize: "17px", mt: 2 }}>
            {el}
        </Typography>)}

        <Box sx={{ mx: 10 }}>

            {extra1}
        </Box>

    </Grid>

    const Second = () => <Grid item xs={12} lg={4}>
        {extra2}
    </Grid>

    return <Box sx={{
        bgcolor: variance ? "primary.main" : "background.paper",
        px: {
            "xs": 4,
            "md": 20,
            "lg": 40
        },
        py: 5
    }}
    >
        <Grid container spacing={3} justifyContent="center" alignItems="center">
            {variance ? <><First /><Second /></> : <><Second /><First /></>}
        </Grid>
    </Box>

}

export default HomeRow