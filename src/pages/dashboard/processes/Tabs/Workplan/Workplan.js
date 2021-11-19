import { ToggleButton, ToggleButtonGroup, Grid, CircularProgress, Skeleton } from "@material-ui/core";
import useSettings from 'hooks/useSettings';
import React, { useEffect, useState, useCallback } from "react";
import $ from 'jquery';
import colorScale from "utils/colorScale"
import { useSelector } from 'react-redux';
import TaskDrawer from "./TaskDrawer";
import { cleanUnderScores } from "utils/cleanUnderscores";
import Tabs from "../Tabs";
import CoevaluationDrawer from "./CoevaluationDrawer";
import MobileTaskDrawer from "./MobileTaskDrawer";
import MobileDiscriminator from "components/MobileDiscriminator";
import useMounted from "hooks/useMounted";


const Workplan = () => {
  const { settings } = useSettings();

  const [viewMode, setViewMode] = useState("Week")
  const [loaded, setLoaded] = useState(false)
  const { phaseinstantiations, objectiveinstantiations, taskinstantiations, updating, selectedPhaseTab } = useSelector((state) => state.process);
  const mounted = useMounted();

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

    const phaseinstantiation = phaseinstantiations.find(phaseinstantiation => selectedPhaseTab === phaseinstantiation.name)
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

    return () => {
      setLoaded(false);
    };
  }, []);

  function stopEvent(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const setNewGantt = useCallback(async (id, props) => {
    try {
      if (mounted.current) {
        new window.Gantt(id, getTasks(), props);

        if(settings.theme === "DARK"){
          $(".gantt .grid-header").css("fill", "#293142")
          $(".gantt .grid-row").css("fill", "#1c2531")
          $(".gantt .grid-row:nth-child(even)").css("fill", "#293142")
          $(".gantt .tick").css("stroke", "#606060")
          $(".gantt .upper-text").css("fill", "white")
          $(".gantt .lower-text").css("fill", "white")
          
          
        }

        $(".gantt-objective").each(function (index1) {
          const id = $(this).attr("data-id")
          const objectiveinstantiation = objectiveinstantiations.find(o => o.id === id)
          $(this).on("click", function () {
            setObjectiveId(id)
            setCoevaluationDrawerOpen(true)
          });

          const bar = $(this).children().first().children(".bar").first()
          const progressBar = $(this).children().first().children(".bar-progress").first()
          progressBar.css("fill", colorScale(objectiveinstantiation.progress / 100).toString())
          let text = $(this).children().first().children(".bar-label").first()

          text.css("font-weight", "800")
          text.css("font-size", "15px")
          
          if(settings.theme === "DARK"){
            if(objectiveinstantiation.start_date && objectiveinstantiation.end_date){
              text.css("fill", "#282b28")
            }else{
              text.css("fill", "white")
            }
            
          }else{
            text.css("fill", "#282b28")
          }

        })

        $(".gantt-task").each(function (index1) {
          const id = $(this).attr("data-id")
          const task = taskinstantiations.find(t => t.id === id)

          $(this).on("click", function () {
            setTaskId(id)
            setDrawerOpen(true)
          });
          const bar = $(this).children().first().children(".bar").first()
          const progressBar = $(this).children().first().children(".bar-progress").first()
          progressBar.css("fill", colorScale(task.progress / 100).toString())

          let text = $(this).children().first().children(".bar-label").first()
          text.css("font-weight", "600")

          if(settings.theme === "DARK"){
            if(task.start_date && task.end_date){
              text.css("fill", "black")
            }else{
              text.css("fill", "white")
            }
            
          }else{
            text.css("fill", "black")
          }
          

        })

        
       
      
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  const view_modes = ["Quarter Day", "Half Day", "Day", "Week", "Month"]

  useEffect(() => {
    if (updating || !loaded) {
      return
    }
    const id = "#gantt"
    const props = {
      header_height: 50,
      column_width: 30,
      step: 24,
      view_modes: view_modes,
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
    setNewGantt(id, props)

  }, [loaded, viewMode, selectedPhaseTab, taskinstantiations, updating, setNewGantt]);




  return (
    <Grid container>

      <Grid item xs={12}>
        <Tabs additionalContent={<ToggleButtonGroup
          color="primary"
          value={viewMode}
          fullWidth
          exclusive
          sx={{ backgroundColor: "background.paper" }}
          onChange={(event, view_mode) => view_mode && view_mode !== viewMode && setViewMode(view_mode)}
        >
          {view_modes.map((el, i) => <ToggleButton key={`separatorButton${i}`} value={el}>{el}</ToggleButton>)}

        </ToggleButtonGroup>} />
      </Grid>
      <Grid item xs={12}>
        {updating ? <Skeleton variant="rectangular" width={"100%"} height={"70vh"} />
 :
          <div id="gantt" />
        }
      </Grid>
      <CoevaluationDrawer open={coevaluationDrawerOpen} onClose={() => setCoevaluationDrawerOpen(false)} objective={selectedObjective} />
      <MobileDiscriminator
        defaultNode={<TaskDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} task={selectedTask} />}
        onMobileNode={<MobileTaskDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} task={selectedTask} />} />
    </Grid>
  );
};

export default Workplan