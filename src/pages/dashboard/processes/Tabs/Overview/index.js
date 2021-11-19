import React, { useState } from "react";
import { TextField as MuiTextField, Grid, Box, Stack, SpeedDial, Button, SpeedDialAction, SpeedDialIcon } from "@material-ui/core";
import { useSelector } from 'react-redux';
import { Save, Print, Share, Delete, Add, Edit } from '@material-ui/icons';



const OverviewTab = () => {
    const [editMode, setEditMode] = useState(false)
    const { process } = useSelector((state) => state.process);

    const TextField = (props) => <Grid item xs={12} ><MuiTextField
        fullWidth
        minRows={4}
        variant={editMode ? "filled" : "standard"}
        InputProps={{
            readOnly: !editMode,
        }}
        sx={{ mb: 2, ml: 2, mr: 2 }}
        {...props}
    /></Grid>

    const viewActions = [
        { icon: <Edit />, name: 'Edit', action: () => setEditMode(!editMode) },
        { icon: <Print />, name: 'Print', action: () => setEditMode(!editMode) },
        { icon: <Share />, name: 'Share', action: () => setEditMode(!editMode) },
    ];

    return (
        <Box style={{ minHeight: "85vh", backgroundColor: "background.default" }}>
            {!editMode && <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{ position: 'absolute', top: 50, right: 35 }}
                icon={<Add />}
                direction="left"
            >
                {viewActions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        onClick={action.action}
                    />
                ))}
            </SpeedDial>}

            <Grid container sx={{ mt: 4 }}>
                <TextField label="NAME" defaultValue={process.artefact.name} />
                <TextField label="SHORT DESCRIPTION OF THE PROJECT" multiline defaultValue={process.artefact.description} />
                <TextField label="AIM OF THE PROJECT" multiline />
                <TextField label="IDEA OF SERVICE TO BE CO-DELIVERED" multiline />
                <TextField label="ACTUAL ORGANIZATION OF THE SERVICE" multiline />
                <TextField label="CHALLENGES OF THE ACTUAL SERVICE" multiline />
            </Grid>

            {editMode && <Stack direction="row" spacing={2} sx={{justifyContent: "center"}}>

                <Button variant="outlined" color="error" startIcon={<Delete />}> Delete</Button>
                <Button variant="outlined" color="success" startIcon={<Save />} onClick={() => setEditMode(!editMode)}> Save</Button>
            </Stack>}

        </Box>
    );
};

export default OverviewTab