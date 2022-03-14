import { Grid, Skeleton, ToggleButton, ToggleButtonGroup } from "@material-ui/core";
import { TreeItemDialog } from "components/dashboard/tree";
import useMounted from "hooks/useMounted";
import useSettings from 'hooks/useSettings';
import $ from 'jquery';
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { cleanUnderScores } from "utils/cleanUnderscores";
import colorScale from "utils/colorScale";
import PhaseTabs from "../PhaseTabs";
import Gantt from "./FrappeGantt"
import "./FrappeGantt.css"

const view_modes = ["Day", "Week", "Month", "Year"]


const setNewGantt = (id, props, tasks, darkMode, onClick) => {
  document.getElementById("gantt").innerHTML = "";
  new Gantt(id, tasks, props);

  if (darkMode) {
    $(".gantt .grid-header").css("fill", "#293142")
    $(".gantt .grid-row").css("fill", "#1c2531")
    $(".gantt .grid-row:nth-child(even)").css("fill", "#293142")
    $(".gantt .tick").css("stroke", "#606060")
    $(".gantt .upper-text").css("fill", "white")
    $(".gantt .lower-text").css("fill", "white")
  }

  $(".gantt-phase").each(function (index1) {
    const id = $(this).attr("data-id")
    $(this).on("click", function () {
      onClick(id, "phase")
    });
  })

  $(".gantt-objective").each(function (index1) {
    const id = $(this).attr("data-id")
    $(this).on("click", function () {
      onClick(id, "objective")
    });
  })

  $(".gantt-task").each(function (index1) {
    const id = $(this).attr("data-id")
    $(this).on("click", function () {
      onClick(id, "task")
    });
  })

}

const Workplan = () => {
  const { settings } = useSettings();

  const [viewMode, setViewMode] = useState("Week")
  const { phases, objectives, tasks, updating, selectedPhaseTab } = useSelector((state) => state.process);
  const mounted = useMounted();

  const [clickedElement, setClickedElement] = useState(null);

  const getElement = (id, type) => {
    let obj = {}
    if (type === "phase") {
      obj = phases.find(el => el.id === id)
    }
    else if (type === "objective") {
      obj = objectives.find(el => el.id === id)
    }
    else if (type === "task") {
      obj = tasks.find(el => el.id === id)
    }
    return {...obj, type}
  }

  const getClasses = (element) => {
    let classes = ""
    if(element.status === "in_progress"){
      classes += " in_progress"
    }
    if(element.status === "finished"){
      classes += " finished"
    }
    if(element.status === "awaiting"){
      classes += " awaiting"
    }
    if(element.start_date){
      classes += " timed"
    }
    
    return classes
  }

  const getTasks = () => {
    const final = []

    const phase = phases.find(phase => selectedPhaseTab === phase.name)
    if(phase){
      final.push({
        id: phase.id,
        name: phase.name,
        start: phase.start_date,
        end: phase.end_date,
        progress: phase.progress,
        custom_class: 'gantt-phase' + getClasses(phase),
        read_only: true
      })
      objectives.filter(el => el.phase_id === phase.id).forEach(objective => {
  
        final.push({
          id: objective.id,
          name: objective.name,
          dependencies: phase.id,
          start: objective.start_date || phase.start_date,
          end: objective.end_date,
          progress: objective.progress,
          custom_class: 'gantt-objective' + getClasses(objective),
          read_only: true
        })
        tasks.filter(el => el.objective_id === objective.id).forEach(task => {
          final.push({
            id: task.id,
            name: task.name,
            dependencies: task.objective_id,
            start: task.start_date || objective.start_date || phase.start_date,
            end: task.end_date,
            custom_class: 'gantt-task' + getClasses(task),
            read_only: true
          })
        })
      })
    }
    
    return final
    // .sort((a, b) => a.start_date < b.start_date)
  }

  function stopEvent(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  useEffect(() => {
    if (updating) {
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
      custom_popup_html: null,
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
    setNewGantt(id, props, getTasks(), settings.theme === "DARK", (id, type) => {
      setClickedElement(getElement(id, type));
    })

  }, [viewMode, selectedPhaseTab, updating, setNewGantt]);

  return (
    <Grid container style={{ overflow: "hidden" }}>
      {clickedElement && <TreeItemDialog type={clickedElement.type} element={clickedElement} onClose={() => setClickedElement(null)} />}
      <Grid item xs={12}>
        <PhaseTabs />
        <ToggleButtonGroup
          color="primary"
          value={viewMode}
          fullWidth
          exclusive
          sx={{ backgroundColor: "background.paper" }}
          onChange={(event, view_mode) => view_mode && view_mode !== viewMode && setViewMode(view_mode)}
        >
          {view_modes.map((el, i) => <ToggleButton key={`separatorButton${i}`} value={el}>{el}</ToggleButton>)}

        </ToggleButtonGroup>
      </Grid>
      <Grid item xs={12}>
        {updating ? <Skeleton variant="rectangular" width={"100%"} height={"70vh"} /> : <div id="gantt" />}
      </Grid>
    </Grid>
  );
};

export default Workplan