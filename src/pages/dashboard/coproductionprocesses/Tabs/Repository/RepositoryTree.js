import { useEffect, useState } from 'react';
import {
  SvgIcon,
  LinearProgress,
  alpha,
} from '@material-ui/core';
import {
  TreeItem,
  TreeView,
  treeItemClasses,
} from '@material-ui/lab';
import { styled } from '@material-ui/styles';
import { cleanUnderScores } from "utils/cleanUnderscores"
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedTask } from 'slices/process';


const RepositoryTree = ({setSelectedTask, loading}) => {
  const [selectedItem, setSelectedItem] = useState([]);
  const { phaseinstantiations, objectiveinstantiations, taskinstantiations, selectedPhaseTab } = useSelector((state) => state.process);
  const currentPhase = phaseinstantiations.find(el => el.name === selectedPhaseTab)

  const dispatch = useDispatch();

  useEffect(() => {
  }, [])
  
  const onSelectedItemChange = (nodeIds) => {
    setSelectedItem(nodeIds)
    
    const taskselected = taskinstantiations.find(el => el.id === nodeIds)
    if (taskselected) {
      setSelectedTask(taskselected)
    }
  }

 
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

  return (
    <TreeView
      disableSelection={loading}
      aria-label="customized"
      defaultExpanded={phaseinstantiations.map(phaseinstantiation => phaseinstantiation.id) || []}
      defaultCollapseIcon={<MinusSquare />}
      defaultExpandIcon={<PlusSquare />}
      defaultEndIcon={<CloseSquare />}
      selected={selectedItem}
      sx={{ flexGrow: 1, overflowY: 'auto', width: "100%" }}
      onNodeSelect={(event, nodeIds, moreinfo) => {
        onSelectedItemChange(nodeIds);
      }}
    >
      {objectiveinstantiations.filter(el => el.phaseinstantiation_id === currentPhase.id).map(objectiveinstantiation =>
        <StyledTreeItem key={objectiveinstantiation.id} nodeId={objectiveinstantiation.id} sx={{ backgroundColor: "background.paper" }} label={<p>{cleanUnderScores(objectiveinstantiation.name)}{objectiveinstantiation.start_date && <LinearProgress sx={{ mt: 1 }} color={objectiveinstantiation.progress < 30 ? "error" : objectiveinstantiation.progress < 65 ? "warning" : "success"} variant="determinate" value={objectiveinstantiation.progress} />}</p>} >
          {taskinstantiations.filter(el => el.objectiveinstantiation_id === objectiveinstantiation.id).sort((a, b) => b.progress - a.progress).map(taskinstantiation => (
            <StyledTreeItem key={taskinstantiation.id} nodeId={taskinstantiation.id} label={<p>{cleanUnderScores(taskinstantiation.name)}</p>} />))}
        </StyledTreeItem>)}
    </TreeView>
  );
};

export default RepositoryTree;
