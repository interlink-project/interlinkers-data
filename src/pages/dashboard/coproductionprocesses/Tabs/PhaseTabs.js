import { AppBar, Tab, Tabs as MuiTabs } from "@material-ui/core";
import React, { useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';
import CircularProgressWithLabel from "components/CircularProgress";
import { setSelectedPhaseTab } from "slices/process";
import useMounted from 'hooks/useMounted';

const PhaseTabs = ({ additionalContent }) => {
    const { selectedPhaseTab, phases} = useSelector((state) => state.process);
    const dispatch = useDispatch();
    const mounted = useMounted();

    const setNewPhaseTab = useCallback((event, value) => {
        try {
          if (mounted.current) {
            dispatch(setSelectedPhaseTab(value))
          }
        } catch (err) {
          console.error(err);
        }
      }, [mounted]);
    
      function compare( a, b ) {
          if (a.prerequisites_ids.length === 0){
              return -1
          }
          return !a.prerequisites_ids.includes(b.id) ? 1 : 0
      }

      const orderedPhases = [...phases].sort(compare)
    return (
        <AppBar position="static" sx={{ color: "white" }}>
            <MuiTabs
                indicatorColor="secondary"
                onChange={setNewPhaseTab}
                value={selectedPhaseTab}
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
                        value={phase.name}
                    />
                ))}
            </MuiTabs>
            {additionalContent}
        </AppBar>
    );
};

export default PhaseTabs