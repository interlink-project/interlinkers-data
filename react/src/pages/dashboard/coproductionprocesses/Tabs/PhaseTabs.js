import { AppBar, Tab, Tabs as MuiTabs } from "@material-ui/core";
import React, { useMemo } from "react";
import { topologicalSort } from "utils/comparePrerequisites";

const PhaseTabs = ({ selectedPhaseTabId, phases, onSelect }) => {
    const orderedPhases = useMemo(() => topologicalSort(phases), [phases]);

    return (
        <AppBar position="static" sx={{ color: "white" }}>
            <MuiTabs
                indicatorColor="secondary"
                onChange={(event, value) => onSelect(phases.find(el => el.id === value))}
                value={selectedPhaseTabId || orderedPhases[0].id}
                centered

                textColor="inherit"
                aria-label="Coproduction phases tabs"
            >

                {orderedPhases.map((phase) => (
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