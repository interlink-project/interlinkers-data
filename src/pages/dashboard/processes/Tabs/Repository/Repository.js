import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
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
import Assets from './Assets';
import { cleanUnderScores } from "utils/cleanUnderscores"
import { useSelector } from 'react-redux';
import Tabs from "../Tabs";
import MobileDiscriminator from 'components/MobileDiscriminator';
import MobileDrawer from 'components/MobileDrawer';


const Repository = () => {
  const [selected, setSelected] = useState([]);
  const [selectedTask, setSelectedTask] = useState("");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { phaseinstantiations, objectiveinstantiations, taskinstantiations, selectedPhaseTab } = useSelector((state) => state.process);

  const currentPhaseObj = phaseinstantiations.find(el => el.name === selectedPhaseTab)

  useEffect(() => {
    const taskselected = taskinstantiations.find(el => el.id === selected)
    if (taskselected) {
      setSelectedTask(taskselected)
      setMobileDrawerOpen(true)
    }
    // document.getElementById('assetsDiv') && document.getElementById('assetsDiv').scrollIntoView()

  }, [selected]);


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
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>

      <Grid container>
        <Grid item xl={12} lg={12} md={12} xs={12}>
        <Tabs />
        </Grid>
        <Grid item xl={4} lg={4} md={6} xs={12}>
          <TreeView
            aria-label="customized"
            defaultExpanded={phaseinstantiations.map(phaseinstantiation => phaseinstantiation.id) || []}
            defaultCollapseIcon={<MinusSquare />}
            defaultExpandIcon={<PlusSquare />}
            defaultEndIcon={<CloseSquare />}
            selected={selected}
            sx={{ flexGrow: 1, overflowY: 'auto', width: "100%" }}
            onNodeSelect={(event, nodeIds) => {
              setSelected(nodeIds);

            }}
          >
            {objectiveinstantiations.filter(el => el.phaseinstantiation_id === currentPhaseObj.id).map(objectiveinstantiation =>
              <StyledTreeItem key={objectiveinstantiation.id} nodeId={objectiveinstantiation.id} sx={{ backgroundColor: "background.paper" }} label={<p>{cleanUnderScores(objectiveinstantiation.name)}{objectiveinstantiation.start_date && <LinearProgress sx={{ mt: 1 }} color={objectiveinstantiation.progress < 30 ? "error" : objectiveinstantiation.progress < 65 ? "warning" : "success"} variant="determinate" value={objectiveinstantiation.progress} />}</p>} >
                {taskinstantiations.filter(el => el.objectiveinstantiation_id === objectiveinstantiation.id).sort((a, b) => b.progress - a.progress).map(taskinstantiation => (
                  <StyledTreeItem key={taskinstantiation.id} nodeId={taskinstantiation.id} label={<p>{cleanUnderScores(taskinstantiation.name)}{taskinstantiation.start_date && <LinearProgress sx={{ mt: 1 }} color={taskinstantiation.progress < 30 ? "error" : taskinstantiation.progress < 65 ? "warning" : "success"} variant="determinate" value={taskinstantiation.progress} />}</p>} />))}
              </StyledTreeItem>)}
          </TreeView>
        </Grid>

        <MobileDiscriminator defaultNode={
            <Grid item xl={8} lg={8} md={6} xs={12}>
              <div id="assetsDiv">
                {selectedTask && <Box sx={{ p: 2 }}>
                  <Assets selectedTask={selectedTask} />
                </Box>}
              </div>
            </Grid>
          } onMobileNode={
            <MobileDrawer open={mobileDrawerOpen} onClose={() => { setMobileDrawerOpen(false)}} content={<Assets selectedTask={selectedTask} />} />
          } />
      </Grid>

    </Box>
  );
};

export default Repository;
