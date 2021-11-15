import { useState } from 'react';

import { Helmet } from 'react-helmet-async';
import {
  Box,
  Grid,
  Tab,
  Tabs,
  SvgIcon,
  alpha,
  Checkbox
} from '@material-ui/core';
import {
  TreeItem,
  TreeView,
  treeItemClasses,
} from '@material-ui/lab';
import { styled } from '@material-ui/styles';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
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

const WorkplanTab = ({ coproductionprocess, processTree }) => {
  const [currentTab, setCurrentTab] = useState(processTree ? processTree[0].name : "");
  const [selected, setSelected] = useState([]);

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  return (
    <>
      <Helmet>
        <title>Coproduction process workplan</title>
      </Helmet>
      <Box sx={{ width: '100%', bgcolor: 'background.paper', paddingRight: 3, paddingLeft: 3, paddingBottom: 3, paddingTop: 1}}>
        <TreeView
          aria-label="customized"
          defaultExpanded={processTree.map(el => el.id)}
          defaultCollapseIcon={<Checkbox defaultChecked />}
          defaultExpandIcon={<Checkbox />}
          defaultEndIcon={<Checkbox defaultChecked />}
          onNodeSelect={(e) => console.log(e)}
          selected={selected}
          sx={{ flexGrow: 1, overflowY: 'auto', width: "100%" }}
        >
          {processTree.map((phaseinstantiation) => (

            <StyledTreeItem key={phaseinstantiation.id} nodeId={phaseinstantiation.id} label={phaseinstantiation.name} sx={{ mt: 1 }} >

              {phaseinstantiation.objectiveinstantiations.map(objective =>
                <StyledTreeItem key={objective.id} nodeId={objective.id} label={objective.name} sx={{ mt: 2 }} >
                  {objective.taskinstantiations.map(task => (
                    <StyledTreeItem key={task.id} nodeId={task.id} label={task.name} sx={{ mt: 1 }} >
                    </StyledTreeItem>)

                  )}
                </StyledTreeItem>)}
            </StyledTreeItem>
          ))}
        </TreeView>
      </Box>

    </>
  );
};

export default WorkplanTab;
