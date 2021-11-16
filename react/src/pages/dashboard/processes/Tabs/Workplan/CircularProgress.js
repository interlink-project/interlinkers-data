import React from 'react';
import {
    Box,
    Typography,
    CircularProgress,
} from '@material-ui/core';
import colorScale from "../../../../../utils/colorScale"

function CircularProgressWithLabel({ size, value }) {
    // perc2color(value)
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" size={size} value={value === 0 ? 100 : value} sx={{ color: colorScale(value / 100).toString(), borderRadius: "50%" }} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="caption" component="div" color="primary.contrastText" sx={{ fontWeight: 900 }}>
                    {`${Math.round(value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}

export default CircularProgressWithLabel