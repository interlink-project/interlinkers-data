import { SvgIcon, Typography } from '@material-ui/core';
import { TreeView } from '@material-ui/lab';
import { statusColor, statusIcon, StatusText } from 'components/dashboard/assets/Icons';
import { StyledTreeItem } from 'components/dashboard/tree';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import { useEffect, useState } from 'react';
import { getAllChildren } from 'slices/process';

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

const StyledTree = ({ language, parent, selectedTreeItem, setSelectedTreeItem, showIcon = false }) => {
  const [all, setAll] = useState([])
  const [expanded, setExpanded] = useState([])

  useEffect(() => {
    const allItems = getAllChildren([parent])
    setAll(allItems)
    setExpanded(allItems.map(el => el.id))
  }, [parent]);

  const onSelectedItemChange = (event, nodeId) => {
    const selected = all.find(el => el.id === nodeId)
    if (selected && (!selectedTreeItem || selectedTreeItem.id !== selected.id)) {
      setSelectedTreeItem(selected)
    }
  }

  const t = useCustomTranslation(language)

  return (
    <TreeView
      aria-label="customized"
      expanded={expanded}
      defaultCollapseIcon={<MinusSquare />}
      defaultExpandIcon={<PlusSquare />}
      defaultEndIcon={<CloseSquare />}
      selected={selectedTreeItem ? selectedTreeItem.id : parent ? parent.id : null}
      sx={{ flexGrow: 1, overflowY: 'auto', width: "100%", height: "100%" }}
      onNodeSelect={(event, nodeIds, moreinfo) => {
        onSelectedItemChange(event, nodeIds);
      }}
      onNodeToggle={(event, nodeIds) => {
        setExpanded(nodeIds)
      }}
    >
      {parent && <StyledTreeItem icon={showIcon && statusIcon(parent.status)} key={parent.id} nodeId={parent.id} sx={{ backgroundColor: "background.paper" }} label={<p>{parent.name}</p>} >

        {parent.children.map(objective =>
          <StyledTreeItem icon={showIcon && statusIcon(objective.status)} key={objective.id} nodeId={objective.id} sx={{ backgroundColor: "background.paper" }} label={<p>{objective.name}</p>} >
            {objective.children.map(task => (
              <StyledTreeItem icon={showIcon && statusIcon(task.status)} key={task.id} nodeId={task.id} label={
                  <p style={{ alignItems: "center" }}>
                    <Typography>
                      {task.name}
                    </Typography>
                    {task.status && <Typography variant="overline" color={statusColor(task.status)}>
                    <StatusText status={task.status} />
                    </Typography>}
                   
                  </p>} />
            ))}
          </StyledTreeItem>)}
      </StyledTreeItem>}
    </TreeView>
  );
};

export default StyledTree;
