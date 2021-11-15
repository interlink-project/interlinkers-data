import moment from "moment";
import React, { useEffect, useState } from "react";

const tasks = [
  {
    id: 'Task 1',
    name: 'Redesign website',
    start: '2016-12-28',
    end: '2016-12-31',
    progress: 20,
    dependencies: 'Task 2, Task 3',
    custom_class: 'bar-milestone' // optional
  },
  {
    id: 'Task 2',
    name: 'Redesign website',
    start: '2016-12-28',
    end: '2016-12-31',
    progress: 20,
    custom_class: 'bar-milestone' // optional
  },
  {
    id: 'Task 3',
    name: 'Redesign website',
    start: '2016-12-28',
    end: '2016-12-31',
    progress: 20,
    custom_class: 'bar-milestone' // optional
  },
]
const GanttChart = ({ processTree }) => {
  console.log(processTree)

  const getTasks = () => {
    const final = []

    processTree.forEach(phaseinstantiation => {
      let start = moment();
      let end = moment().add(3, 'days');

      final.push({
        id: phaseinstantiation.id,
        name: phaseinstantiation.name,
        start: start.format('YYYY-MM-DD'),
        end: end.format('YYYY-MM-DD'),
        progress: 20
      })
      phaseinstantiation.objectiveinstantiations.forEach(objectiveinstantiation => {
        start = end;
        end = start.add(3, 'days');
        final.push({
          id: objectiveinstantiation.id,
          name: objectiveinstantiation.name,
          start: start.format('YYYY-MM-DD'),
          end: end.format('YYYY-MM-DD'),
          dependencies: phaseinstantiation.id,
          progress: 30
        })

        objectiveinstantiation.taskinstantiations.forEach(taskinstantiation => {
          start = end;
          end = start.add(3, 'days');
          final.push({
            id: taskinstantiation.id,
            name: taskinstantiation.name,
            start: start.format('YYYY-MM-DD'),
            end: end.format('YYYY-MM-DD'),
            dependencies: objectiveinstantiation.id,
            progress: 80
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

    script.onload = () => {
      const gantt = new window.Gantt("#gantt", getTasks(), {
        header_height: 50,
        column_width: 30,
        step: 24,
        view_modes: ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month'],
        bar_height: 20,
        bar_corner_radius: 3,
        arrow_curve: 5,
        padding: 18,
        view_mode: 'Day',
        date_format: 'YYYY-MM-DD',
        custom_popup_html: null
      });
      gantt.change_view_mode('Week')
    };
  }, [processTree]);


  return (
    <div id="gantt" />
  );
};

export default GanttChart