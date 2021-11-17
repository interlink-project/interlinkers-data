import { ToggleButton, ToggleButtonGroup, Grid, AppBar, Tab, Tabs } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import $ from 'jquery';
import colorScale from "utils/colorScale"
import { useSelector } from 'react-redux';
import TaskDrawer from "./TaskDrawer";
import { cleanUnderScores } from "utils/cleanUnderscores";
import CircularProgressWithLabel from "components/CircularProgress";
import CoevaluationDrawer from "./CoevaluationDrawer";

const Workplan = () => {
  const [viewMode, setViewMode] = useState("Week")
  const [loaded, setLoaded] = useState(false)
  const [currentPhase, setCurrentPhase] = useState("engage");
  const { phaseinstantiations, objectiveinstantiations, taskinstantiations, updating } = useSelector((state) => state.process);
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [taskId, setTaskId] = useState(null);
  let selectedTask = null
  if (taskId) {
    selectedTask = taskinstantiations.find(task => task.id === taskId)
  }

  const [coevaluationDrawerOpen, setCoevaluationDrawerOpen] = useState(false);
  const [objectiveId, setObjectiveId] = useState(null);
  let selectedObjective = null
  if (objectiveId) {
    selectedObjective = objectiveinstantiations.find(objective => objective.id === objectiveId)
  }
  const getTasks = () => {
    const final = []

    phaseinstantiations.forEach(phaseinstantiation => {
      if (currentPhase !== phaseinstantiation.name) {
        return
      }

      objectiveinstantiations.filter(el => el.phaseinstantiation_id === phaseinstantiation.id).forEach(objectiveinstantiation => {
        final.push({
          id: objectiveinstantiation.id,
          name: cleanUnderScores(objectiveinstantiation.name),
          start: objectiveinstantiation.start_date,
          end: objectiveinstantiation.end_date,
          progress: objectiveinstantiation.progress,
          custom_class: 'gantt-objective',
          read_only: true
        })
        taskinstantiations.filter(el => el.objectiveinstantiation_id === objectiveinstantiation.id).forEach(taskinstantiation => {
          final.push({
            id: taskinstantiation.id,
            name: cleanUnderScores(taskinstantiation.name),
            start: taskinstantiation.start_date,
            end: taskinstantiation.end_date,
            dependencies: taskinstantiation.objectiveinstantiation_id,
            progress: taskinstantiation.progress,
            custom_class: 'gantt-task',
            read_only: true
          })
        })
      })

      

    })
    return final.sort((a, b) => a.start_date < b.start_date)
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
  }, []);

  function stopEvent(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  useEffect(() => {
    if (updating) {
      return
    }
    const id = "#gantt"
    if (loaded) {
      const props = {
        header_height: 50,
        column_width: 30,
        step: 24,
        view_modes: ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month'],
        bar_height: 25,
        bar_corner_radius: 3,
        arrow_curve: 10,
        padding: 22,
        view_mode: viewMode,
        date_format: 'YYYY-MM-DD',
        custom_popup_html: null
      }

      const readOnly = true
      if (readOnly) {
        props.on_view_change = function () {
          var bars = document.querySelectorAll(id + " .bar-group");
          for (var i = 0; i < bars.length; i++) {
            bars[i].addEventListener("mousedown", stopEvent, true);
          }
          var handles = document.querySelectorAll(id + " .handle-group");
          for (var i = 0; i < handles.length; i++) {
            handles[i].remove();
          }
        }
      }
      try {
        new window.Gantt(id, getTasks(), props);

        $(".gantt-objective").each(function (index1) {
          const id = $(this).attr("data-id")
          $(this).on("click", function () {
            setObjectiveId(id)
            setCoevaluationDrawerOpen(true)
          });

          const bar = $(this).children().first().children(".bar").first()
          const progressBar = $(this).children().first().children(".bar-progress").first()
          progressBar.css("fill", colorScale(objectiveinstantiations.find(objectiveinstantiation => objectiveinstantiation.id === id).progress / 100).toString())
          let text = $(this).children().first().children(".bar-label").first()

          text.css("font-weight", "800")
          text.css("font-size", "15px")
          text.css("fill", "#282b28")

        })

        $(".gantt-task").each(function (index1) {
          const id = $(this).attr("data-id")

          $(this).on("click", function () {
            setTaskId(id)
            setDrawerOpen(true)
          });
          const bar = $(this).children().first().children(".bar").first()
          const progressBar = $(this).children().first().children(".bar-progress").first()
          progressBar.css("fill", colorScale(taskinstantiations.find(task => task.id === id).progress / 100).toString())

          let text = $(this).children().first().children(".bar-label").first()
          text.css("font-weight", "600")
          text.css("fill", "black")

        })

      } catch (error) {
        console.log("error", error)
      }

    }

  }, [loaded, viewMode, currentPhase, taskinstantiations, updating]);

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

            {phaseinstantiations.map((phaseinstantiation) => (
              <Tab
                key={phaseinstantiation.id}
                label={<>
                  <p>{phaseinstantiation.name}</p>
                  <CircularProgressWithLabel value={phaseinstantiation.progress} size={40} sx={{mb: 2}} /></>}
                value={phaseinstantiation.name}
              />
            ))}
          </Tabs>
          <ToggleButtonGroup
            color="primary"
            value={viewMode}
            fullWidth
            exclusive
            sx={{ backgroundColor: "white" }}
            onChange={(event, view_mode) => view_mode !== viewMode && setViewMode(view_mode)}
          >
            {separators.map((el, i) => <ToggleButton key={`separatorButton${i}`} value={el}>{el}</ToggleButton>)}

          </ToggleButtonGroup>
        </AppBar>
      </Grid>
      <Grid item xs={12}>
        {!updating &&
          <div id="gantt" />
        }
      </Grid>
      <TaskDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} task={selectedTask} />
      <CoevaluationDrawer open={coevaluationDrawerOpen} onClose={() => setCoevaluationDrawerOpen(false)} objective={selectedObjective} />
        
    </Grid>
  );
};

export default Workplan