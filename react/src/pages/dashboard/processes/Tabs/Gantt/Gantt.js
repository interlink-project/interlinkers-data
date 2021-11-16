import { ToggleButton, ToggleButtonGroup, Grid, AppBar, Tab, Tabs } from "@material-ui/core";
import moment from "moment";
import React, { useEffect, useState } from "react";
import "./gantt.css"

const GanttChart = ({ processTree }) => {
  const [viewMode, setViewMode] = useState("Week")
  const [loaded, setLoaded] = useState(false)

  const [currentPhase, setCurrentPhase] = useState(processTree ? processTree[0].name : "");

  const getTasks = () => {
    const final = []

    processTree.forEach(phaseinstantiation => {
      if (currentPhase !== phaseinstantiation.name) {
        return
      }
      final.push({
        id: phaseinstantiation.id,
        name: phaseinstantiation.name,
        start: phaseinstantiation.start_date,
        end: phaseinstantiation.end_date,
        progress: 20,
        custom_class: 'gantt-phase',
        read_only: true
      })
      phaseinstantiation.objectiveinstantiations.forEach(objectiveinstantiation => {

        final.push({
          id: objectiveinstantiation.id,
          name: objectiveinstantiation.name,
          start: objectiveinstantiation.start_date,
          end: objectiveinstantiation.end_date,
          dependencies: phaseinstantiation.id,
          progress: 30,
          custom_class: 'gantt-objective',
          read_only: true
        })
        objectiveinstantiation.taskinstantiations.forEach(taskinstantiation => {

          final.push({
            id: taskinstantiation.id,
            name: taskinstantiation.name,
            start: taskinstantiation.start_date,
            end: taskinstantiation.end_date,
            dependencies: objectiveinstantiation.id,
            progress: 80,
            custom_class: 'gantt-task',
            read_only: true
          })
        })
      })

    })
    return final
  }
  useEffect(() => {
    const head = document.head || document.getElementsByTagName('head')[0]

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/frappe-gantt/0.5.0/frappe-gantt.min.js";
    script.async = true;
    head.appendChild(script);

    const style = document.createElement("link");
    style.type = "text/css";
    style.rel = "stylesheet";
    style.href = "https://cdnjs.cloudflare.com/ajax/libs/frappe-gantt/0.5.0/frappe-gantt.css";
    head.appendChild(style);

    script.onload = () => setLoaded(true);
  }, [processTree]);

  useEffect(() => {

    if (loaded) {
      try {
        new window.Gantt("#gantt", getTasks(), {
          header_height: 50,
          column_width: 30,
          step: 24,
          view_modes: ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month'],
          bar_height: 20,
          bar_corner_radius: 3,
          arrow_curve: 5,
          padding: 18,
          view_mode: viewMode,
          date_format: 'YYYY-MM-DD',
          custom_popup_html: null
        });
      } catch (error) {
        console.log("error", error)
      }

    }

  }, [loaded, viewMode, currentPhase]);

  const separators = ["Quarter Day", "Half Day", "Day", "Week", "Month"]



  return (
    <Grid container>

      <Grid item xs={12}>
        <AppBar position="static" sx={{ color: "white" }}>
          <Tabs
            indicatorColor="secondary"
            onChange={(event, value) => {
              setCurrentPhase(value);
            }}
            value={currentPhase}
            centered

            textColor="inherit"
            aria-label="Coproduction phases tabs"
          >

            {processTree.map((phaseinstantiation) => (
              <Tab
                key={phaseinstantiation.id}
                label={phaseinstantiation.name}
                value={phaseinstantiation.name}
              />
            ))}
          </Tabs>
          <ToggleButtonGroup
            color="primary"
            value={viewMode}
            fullWidth
            exclusive
            sx={{backgroundColor: "white"}}
            onChange={(event, view_mode) => view_mode !== viewMode && setViewMode(view_mode)}
          >
            {separators.map((el, i) => <ToggleButton key={`separatorButton${i}`} value={el}>{el}</ToggleButton>)}

          </ToggleButtonGroup>
        </AppBar>
      </Grid>
      <Grid item xs={12}>
        {currentPhase &&
          <div id="gantt" />
        }
      </Grid>

    </Grid>
  );
};

export default GanttChart