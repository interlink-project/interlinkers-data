import { AppBar, Tab, Tabs as MuiTabs } from "@material-ui/core";
import React from "react";

const PhaseTabs = ({ selectedId, treeitems, onSelect }) => {
    return (
        <AppBar position="static" sx={{ color: "white" }}>
            <MuiTabs
                indicatorColor="secondary"
                onChange={(event, value) => onSelect(treeitems.find(el => el.id === value))}
                value={selectedId || treeitems[0].id}
                centered

                textColor="inherit"
                aria-label="Coproduction treeitems tabs"
            >

                {treeitems.map((phase) => (
                    <Tab
                        key={phase.id}
                        label={<>
                            <p>{phase.name}</p>
                            {/* <CircularProgressWithLabel value={phase.progress} size={40} sx={{ mb: 2 }} />*/}</>}
                        value={phase.id}
                    />
                ))}
            </MuiTabs>
        </AppBar>
    );
};

export default PhaseTabs