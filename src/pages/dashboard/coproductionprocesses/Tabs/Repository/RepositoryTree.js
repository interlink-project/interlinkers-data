import {
  alpha, SvgIcon, Typography
} from '@material-ui/core';
import {
  TreeItem, treeItemClasses, TreeView, useTreeItem
} from '@material-ui/lab';
import { styled } from '@material-ui/styles';
import { statusIcon } from 'components/dashboard/assets/Icons';
import { useEffect, useState, forwardRef } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

const CustomContent = forwardRef(function CustomContent(props, ref) {
  const {
    classes,
    className,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
  } = props;

  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
    preventSelection,
  } = useTreeItem(nodeId);

  const icon = iconProp || expansionIcon || displayIcon;

  const handleMouseDown = (event) => {
    preventSelection(event);
  };

  const handleExpansionClick = (event) => {
    handleExpansion(event);
  };

  const handleSelectionClick = (event) => {
    handleSelection(event);
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disabled,
      })}
      onMouseDown={handleMouseDown}
      ref={ref}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {icon}
      </div>
      <Typography
        onClick={handleSelectionClick}
        component="div"
        className={classes.label}
      >
        {label}
      </Typography>
    </div>
  );
});

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
  <TreeItem ContentComponent={CustomContent} {...props} />
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
  const { selectedTask } = useSelector((state) => state.process);

  const [selectedItem, setSelectedItem] = useState(selectedTask && selectedTask.id);
  const { phases, objectives: allObjectives, tasks: allTasks, selectedPhaseTab } = useSelector((state) => state.process);
  const currentPhase = phases.find(el => el.name === selectedPhaseTab)

  const objectives = allObjectives.filter(el => el.phase_id === currentPhase.id)

  const onSelectedItemChange = (event, nodeIds) => {
    event.stopPropagation();
    event.preventDefault()
    setSelectedItem(nodeIds)
    console.log(nodeIds)

    const taskselected = allTasks.find(el => el.id === nodeIds)
    // if the selection is a task
    if (taskselected) {
      setSelectedTask(taskselected)
    }
  }

  return (
    <TreeView
      disableSelection={loading}
      aria-label="customized"
      defaultExpanded={allObjectives.concat(allTasks).map(objective => objective.id) || []}
      defaultCollapseIcon={<MinusSquare />}
      defaultExpandIcon={<PlusSquare />}
      defaultEndIcon={<CloseSquare />}
      selected={selectedItem}
      sx={{ flexGrow: 1, overflowY: 'auto', width: "100%", bgcolor: "primary.main" }}
      onNodeSelect={(event, nodeIds, moreinfo) => {
        onSelectedItemChange(event, nodeIds);
      }}
    >
      {objectives.map(objective =>
        <StyledTreeItem icon={statusIcon(objective.status)} key={objective.id} nodeId={objective.id} sx={{ backgroundColor: "background.paper" }} label={<p>{objective.name}</p>} >
          {allTasks.filter(el => el.objective_id === objective.id).sort((a, b) => b.progress - a.progress).map(task => (
            <StyledTreeItem icon={statusIcon(task.status)} key={task.id} nodeId={task.id} label={
              <p style={{ alignItems: "center" }}>
                {task.name}
              </p>} />
          ))}
        </StyledTreeItem>)}
    </TreeView>
  );
};

export default RepositoryTree;
