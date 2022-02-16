import { useEffect, useState } from 'react';
import {
  SvgIcon,
  LinearProgress,
  alpha,
  Chip,
  Menu,
  IconButton
} from '@material-ui/core';
import {
  TreeItem,
  TreeView,
  treeItemClasses,
} from '@material-ui/lab';
import { styled } from '@material-ui/styles';
import { cleanUnderScores } from "utils/cleanUnderscores"
import { useDispatch, useSelector } from 'react-redux';
import { InProgressIcon, FinishedIcon, FinishedIconButton } from './Icons';



function MinusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

function CloseSquare(props) {
  return (
    <SvgIcon
      className="close"
      fontSize="inherit"
      style={{ width: 14, height: 14 }}
      {...props}
    >
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}


const StyledTreeItem = styled((props) => (
  <TreeItem {...props} />
))(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

const RepositoryTree = ({ setSelectedTask, loading }) => {
  const [selectedItem, setSelectedItem] = useState([]);
  const { phases, objectives : allObjectives, tasks : allTasks, selectedPhaseTab } = useSelector((state) => state.process);
  const currentPhase = phases.find(el => el.name === selectedPhaseTab)

  const objectives = allObjectives.filter(el => el.phase_id === currentPhase.id)
  const dispatch = useDispatch();

  useEffect(() => {
    // TODO: Get current phase form coproduction process and go to corresponding tab
  }, [])

  const onSelectedItemChange = (nodeIds) => {
    setSelectedItem(nodeIds)

    const taskselected = allTasks.find(el => el.id === nodeIds)
    if (taskselected) {
      setSelectedTask(taskselected)
    }
  }



  return (
    <TreeView
      disableSelection={loading}
      aria-label="customized"
      defaultExpanded={objectives.map(objective => objective.id) || []}
      defaultCollapseIcon={<MinusSquare />}
      defaultExpandIcon={<PlusSquare />}
      defaultEndIcon={<CloseSquare />}
      selected={selectedItem}
      sx={{ flexGrow: 1, overflowY: 'auto', width: "100%" }}
      onNodeSelect={(event, nodeIds, moreinfo) => {
        onSelectedItemChange(nodeIds);
      }}
    >
      {objectives.map(objective =>
        <StyledTreeItem key={objective.id} nodeId={objective.id} sx={{ backgroundColor: "background.paper" }} label={<p>{cleanUnderScores(objective.name)}{objective.start_date && <LinearProgress sx={{ mt: 1 }} color={objective.progress < 30 ? "error" : objective.progress < 65 ? "warning" : "success"} variant="determinate" value={objective.progress} />}</p>} >
          {allTasks.filter(el => el.objective_id === objective.id).sort((a, b) => b.progress - a.progress).map(task => (
            <StyledTreeItem key={task.id} nodeId={task.id} label={
            <p >
              {task.status === "finished" && <FinishedIconButton />}
              {task.status === "in_progress" && <InProgressIcon />}
              {cleanUnderScores(task.name)}</p>} />
            ))}
        </StyledTreeItem>)}
    </TreeView>
  );
};

export default RepositoryTree;
