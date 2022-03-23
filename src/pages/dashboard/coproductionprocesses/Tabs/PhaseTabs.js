import { AppBar, Tab, Tabs as MuiTabs } from "@material-ui/core";
import React, { useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';
import CircularProgressWithLabel from "components/CircularProgress";
import { setselectedPhaseTabId } from "slices/process";
import useMounted from 'hooks/useMounted';

const PhaseTabs = () => {
    const { selectedPhaseTabId, phases} = useSelector((state) => state.process);
    const dispatch = useDispatch();
    const mounted = useMounted();

    const setNewPhaseTab = useCallback((event, value) => {
        try {
          if (mounted.current) {
            dispatch(setselectedPhaseTabId(value))
          }
        } catch (err) {
          console.error(err);
        }
      }, [mounted]);
    
      
    return (
        <AppBar position="static" sx={{ color: "white" }}>
            <MuiTabs
                indicatorColor="secondary"
                onChange={setNewPhaseTab}
                value={selectedPhaseTabId}
                centered

                textColor="inherit"
                aria-label="Coproduction phases tabs"
            >

                {phases.map((phase) => (
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