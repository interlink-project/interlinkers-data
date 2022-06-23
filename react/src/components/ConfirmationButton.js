
import { Box, Popover, Typography } from '@material-ui/core';
import React, { useState } from 'react';

const ConfirmationButton = ({ text, Actionator, ButtonComponent, onClick}) => {

    const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);

    const handlePopoverClick = (event) => {
        setPopoverAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setPopoverAnchorEl(null);
    };

    const popoverOpen = Boolean(popoverAnchorEl);

    return <>
        <Actionator onClick={handlePopoverClick} />
        <Popover
            open={popoverOpen}
            anchorEl={popoverAnchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            <Box sx={{ p: 2 }}>
                <Typography>{text}</Typography>
                <ButtonComponent onClick={() => {
                    handlePopoverClose();
                    onClick();
                }} />
            </Box>

        </Popover>
    </>
}

export default ConfirmationButton