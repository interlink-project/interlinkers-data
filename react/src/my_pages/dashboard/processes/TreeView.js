import * as React from 'react';
import { alpha, Button, Divider, Stack, IconButton, Box, Grid, Card, CardHeader, CardMedia, CardContent, CardActions, Collapse, CircularProgress, Skeleton, Typography, SvgIcon, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@material-ui/core';
import {
    TreeItem,
    TreeView,
    treeItemClasses,
} from '@material-ui/lab';
import { grey, red } from '@material-ui/core/colors';
import { objectiveInstantiationsApi } from '../../../__fakeApi__/objectiveinstantiationsApi';
import { tasksApi } from '../../../__fakeApi__/tasksApi';
import { assetsApi } from '../../../__fakeApi__/assetsApi';
import InterlinkerPreview from './InterlinkerPreview';
import { styled } from '@material-ui/styles';
import useMounted from '../../../hooks/useMounted';

import moment from 'moment'
import prettyBytes from "pretty-bytes"
import { Favorite, Share, ExpandMore as ExpandMoreIcon, MoreVert, CheckCircle, Delete } from '@material-ui/icons';

const cleanUnderScores = (str) => str && (str.charAt(0).toUpperCase() + str.slice(1)).replace(/_/g, ' ');
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


const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

function CircularProgressWithLabel(props) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="caption" component="div" color="text.secondary">
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}

export default function CustomizedTreeView({ phaseinstantiations = [] }) {
    const mounted = useMounted();

    const [selected, setSelected] = React.useState([]);
    const [loadingObjective, setLoadingObjective] = React.useState(false);
    const [selectedObjective, setSelectedObjective] = React.useState("");

    const [lastSelected, setLastSelected] = React.useState("");

    const [loadingTask, setLoadingTask] = React.useState(false);
    const [selectedTask, setSelectedTask] = React.useState("");
    const [loadingAsset, setLoadingAsset] = React.useState(false);
    const [selectedAsset, setSelectedAsset] = React.useState("");

    const [interlinkerId, setInterlinkerId] = React.useState("");
    const [expanded, setExpanded] = React.useState(false);

    const [creatingAsset, setCreatingAsset] = React.useState(false);

    const closeInterlinkerDialog = () => setInterlinkerId("")
    const createAsset = async (interlinker) => {
        setCreatingAsset(true)
        const lastTask = { ...selectedTask }
        const data = await assetsApi.create(
            selectedTask.id,
            interlinker.last_version.id
        );
        setCreatingAsset(false)
        closeInterlinkerDialog()

        console.log(selectedObjective.id)
        await handleSelect(null, selectedObjective.id)
        setSelectedTask(lastTask)
        setSelectedAsset(data)
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleSelect = async (event, nodeIds) => {
        setSelected(nodeIds);
        const idIsObjective = phaseinstantiations.some(function (e) {
            return e.objectiveinstantiations.map(act => act.id).includes(nodeIds);
        })

        if (idIsObjective) {
            setLoadingObjective(true)
            const data = await objectiveInstantiationsApi.get(nodeIds)
            setSelectedObjective(data)
            setSelectedTask("")
            setSelectedAsset("")
            setLoadingObjective(false)
            setLastSelected("objective")
            return
        }

        const idIsTask = selectedObjective && selectedObjective.taskinstantiations.some((task) => task.id === nodeIds);
        if (idIsTask) {
            setLoadingTask(true)
            // const data = await tasksApi.get(nodeIds)
            setSelectedTask(selectedObjective.taskinstantiations.find(el => el.id === nodeIds))
            setSelectedAsset("")
            setLoadingTask(false)
            setLastSelected("task")
            return
        }

        const idIsAsset = selectedObjective.taskinstantiations.some(function (e) {
            return e.assets.map(as => as.id).includes(nodeIds);
        })


        if (idIsAsset) {
            setLoadingAsset(true)
            const data = await assetsApi.get(nodeIds)
            setSelectedAsset(data)
            setLoadingAsset(false)
            setLastSelected("asset")
            return
        }
    };

    return (
        <Grid container spacing={1}>
            {interlinkerId !== "" && <InterlinkerPreview interlinkerId={interlinkerId} closeCallback={closeInterlinkerDialog} createAssetCallback={createAsset} creatingAsset={creatingAsset} />
            }
            <Grid item xs={3} >
                <Box>

                    <Typography variant="h5" gutterBottom component="div">
                        Phases and objectives
                    </Typography>
                </Box>
                <TreeView
                    aria-label="customized"
                    defaultExpanded={phaseinstantiations.map(el => el.id) || []}
                    defaultCollapseIcon={<MinusSquare />}
                    defaultExpandIcon={<PlusSquare />}
                    defaultEndIcon={<CloseSquare />}
                    selected={selected}
                    sx={{ flexGrow: 1, overflowY: 'auto' }}
                    onNodeSelect={handleSelect}
                >

                    {phaseinstantiations.map(el =>
                        <StyledTreeItem key={el.id} nodeId={el.id} label={<p>{cleanUnderScores(el.name)}</p>}>
                            {el.objectiveinstantiations.map(objective => <StyledTreeItem key={objective.id} nodeId={objective.id} label={<p>{cleanUnderScores(objective.name)} ({objective.tasks_length})</p>} />)}
                        </StyledTreeItem>)}
                </TreeView>
            </Grid>
            <Grid item xs={3} sx={{ borderLeft: `1px solid ${grey[100]}` }} >
                <Divider orientation="vertical" flexItem />
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h5" gutterBottom component="div">
                        Tasks and assets for
                    </Typography>
                    <Typography variant="overline" gutterBottom>{cleanUnderScores(selectedObjective.name)}
                    </Typography>
                </Box>
                {selectedObjective === "" ? <Skeleton animation={loadingObjective ? "wave" : false} variant="rectangular" height="100%" /> : <TreeView
                    aria-label="customized"
                    defaultExpanded={selectedObjective.taskinstantiations.map(el => el.id)}
                    defaultCollapseIcon={<MinusSquare />}
                    defaultExpandIcon={<PlusSquare />}
                    defaultEndIcon={<CloseSquare />}
                    onNodeSelect={handleSelect}
                    selected={selected}
                    sx={{ flexGrow: 1, overflowY: 'auto' }}
                >

                    {selectedObjective.taskinstantiations.map(el =>
                        <StyledTreeItem key={el.id} nodeId={el.id} label={<Grid alignItems="center" container justifyContent="center" sx={{mt: 2, mb: 2, alignText: "center"}} ><Grid item xs={12}><CircularProgressWithLabel value={40} size={30} sx={{ backgroundColor: "background.default", borderRadius: "50%", m: 1 }} /></Grid><Grid item xs={12}>{cleanUnderScores(el.name)}</Grid></Grid>} >
                            {el.assets.map(asset => <StyledTreeItem key={asset.id} nodeId={asset.id} label={
                                <p><Avatar src={asset.file_metadata.icon_link} sx={{ width: 24, height: 24 }} />
                                    {cleanUnderScores(asset.name)}</p>

                            }>

                            </StyledTreeItem>)}
                        </StyledTreeItem>)}
                </TreeView>}

            </Grid>
            <Grid item xs={6} sx={{ borderLeft: `1px solid ${grey[100]}` }}>
                {selectedAsset === "" && selectedTask === "" ? <Skeleton animation={loadingAsset ? "wave" : false} variant="rectangular" height="100%" /> :

                    <>
                        {lastSelected === "task" &&
                            <Box sx={{ p: 2 }}>
                                <Grid container sx={{ mb: 2, p: 2, backgroundColor: "background.default" }} justifyContent="space-between" alignItems="center"
                                >
                                    <Grid item>
                                        <Typography variant="overline">Task</Typography>

                                        <Typography variant="h6">{cleanUnderScores(selectedTask.name)}</Typography>
                                        <Typography paragraph>{selectedTask.description}</Typography>
                                    </Grid><Grid item>
                                        <CircularProgressWithLabel value={40} size={80} sx={{ backgroundColor: "background.default", borderRadius: "50%" }} />
                                    </Grid>

                                </Grid>
                                <Typography variant="overline" gutterBottom>
                                    Recommended interlinkers
                                </Typography>
                                <List sx={{ width: '100%' }}>
                                    {selectedTask.recommended_interlinkers.map(interlinker => <ListItem key={interlinker.id} sx={{ bgcolor: 'background.default' }} button onClick={() => setInterlinkerId(interlinker.id)}>
                                        <ListItemAvatar key={interlinker.id}>
                                            <Avatar src={interlinker.logotype} />
                                        </ListItemAvatar>
                                        <ListItemText primary={cleanUnderScores(interlinker.name)} secondary={`${interlinker.nature === "KN" ? "Knowledge" : "Software"} interlinker`} />
                                    </ListItem>)}
                                </List>
                            </Box>
                        }

                        {lastSelected === "asset" &&
                            <>
                                <CardHeader
                                    avatar={
                                        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                            R
                                        </Avatar>
                                    }
                                    action={
                                        <IconButton aria-label="settings">
                                            <MoreVert />
                                        </IconButton>
                                    }
                                    title={cleanUnderScores(selectedAsset.name)}
                                    subheader={selectedAsset.created_at}
                                />
                                <Box sx={{ textAlign: "center", width: "100%" }} justifyContent="center">
                                    <CardMedia
                                        component="img"
                                        sx={{ width: "200px", border: "1px solid black" }}
                                        image={selectedAsset && selectedAsset.file_metadata.thumbnail_link}
                                    />
                                    <Button sx={{ mt: 2 }} variant="contained" rel="noopener noreferrer" href={selectedAsset.work_link} target="_blank">Open</Button>
                                    <Button sx={{ mt: 2 }} onClick={() => assetsApi.delete(selectedAsset.id)}>Delete</Button>

                                </Box>
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary">
                                        some other text
                                    </Typography>
                                </CardContent>
                                <CardActions disableSpacing>
                                    <IconButton aria-label="add to favorites">
                                        <Favorite />
                                    </IconButton>
                                    <IconButton aria-label="share">
                                        <Share />
                                    </IconButton>
                                    <ExpandMore
                                        expand={expanded}
                                        onClick={handleExpandClick}
                                        aria-expanded={expanded}
                                        aria-label="show more"
                                    >
                                        <ExpandMoreIcon />
                                    </ExpandMore>
                                </CardActions>
                                <Collapse in={expanded} timeout="auto" unmountOnExit>
                                    <CardContent>
                                        <Typography paragraph>Method:</Typography>
                                        <Typography paragraph>
                                            {selectedAsset.file_metadata.size && prettyBytes(parseInt(selectedAsset.file_metadata.size))}
                                            {moment(selectedAsset.created_at).fromNow()}{moment(selectedAsset.file_metadata.modified_time).fromNow()}
                                        </Typography>
                                        <Typography paragraph>
                                            Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over
                                            medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring
                                            occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a
                                            large plate and set aside, leaving chicken and chorizo in the pan. Add
                                            pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook,
                                            stirring often until thickened and fragrant, about 10 minutes. Add
                                            saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
                                        </Typography>
                                        <Typography paragraph>
                                            Add rice and stir very gently to distribute. Top with artichokes and
                                            peppers, and cook without stirring, until most of the liquid is absorbed,
                                            15 to 18 minutes. Reduce heat to medium-low, add reserved shrimp and
                                            mussels, tucking them down into the rice, and cook again without
                                            stirring, until mussels have opened and rice is just tender, 5 to 7
                                            minutes more. (Discard any mussels that don’t open.)
                                        </Typography>
                                        <Typography>
                                            Set aside off of the heat to let rest for 10 minutes, and then serve.
                                        </Typography>
                                    </CardContent>
                                </Collapse>
                            </>
                        }

                    </>}
            </Grid>

        </Grid>
    );
}