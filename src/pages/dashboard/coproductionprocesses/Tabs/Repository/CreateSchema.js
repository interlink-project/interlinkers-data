import {
    Avatar, Box, Button, Collapse, Grid, Menu, MenuItem,
    ToggleButton,
    ToggleButtonGroup, alpha,
    CircularProgress, Paper, Typography, InputBase,
    Divider, Stack, Card, CardContent, CardMedia, CardActionArea, CardActions, CardHeader
} from '@material-ui/core';
import { Check, ChevronRight, ExpandMore, Info as InfoIcon, KeyboardArrowDown, KeyboardArrowUp, Search as SearchIcon } from '@material-ui/icons';
import { styled } from '@material-ui/styles';
import MobileDiscriminator from 'components/MobileDiscriminator';
import MobileDrawer from 'components/MobileDrawer';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { cleanUnderScores } from 'utils/cleanUnderscores';
import { coproductionProcessesApi, interlinkersApi, tasksApi } from '__fakeApi__';
import PhaseTabs from "../PhaseTabs";
import Assets from './Assets';
import NewAssetModal from './NewAssetModal';
import RepositoryTree from "./RepositoryTree";
import { truncate } from 'lodash';
import { FinishedIcon, InProgressIcon } from './Icons';
import { useDispatch, useSelector } from 'react-redux';
import { setProcess, updateTask } from 'slices/process';
import { coproductionSchemasApi } from '__fakeApi__/coproduction/coproductionSchemasApi';
import {
    TreeItem,
    TreeView,
} from '@material-ui/lab';
import { comparePrerequisites } from 'utils/comparePrerequisites';
import useMounted from 'hooks/useMounted';

const sameHeightCards = {
    minHeight: "200px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
}
const CreateSchema = () => {
    const [loading, setLoading] = useState(true)
    const [schemas, setSchemas] = useState([])
    const { process } = useSelector((state) => state.process);
    const dispatch = useDispatch()
    const mounted = useMounted();

    const setCoproductionProcess = useCallback(async (process) => {
        try {

            if (mounted.current) {
                dispatch(setProcess(process))
            }
        } catch (err) {
            console.error(err);
        }
    }, [mounted]);

    const getSchemas = async () => {
        const schemas = await coproductionSchemasApi.getPublic();
        setSchemas(schemas)
        setLoading(false)
    }

    useEffect(() => {
        getSchemas()
    }, [])


    const submit = async (coproductionschema_id) => {
        coproductionProcessesApi.setSchema(process.id, coproductionschema_id).then(process => {
            setCoproductionProcess(process)
        });
    }

    return (

        <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Select a schema to use in your project:</Typography>

            <Grid container spacing={3} justifyContent="flex-start">
                {schemas.map(schema => (
                    <Grid item xs={12} md={6} lg={4} xl={3} key={schema.id}                       >
                        <Card style={sameHeightCards}>
                            <CardHeader title={schema.name} subheader={schema.description}>

                            </CardHeader>
                            <TreeView
                                aria-label="file system navigator"
                                defaultCollapseIcon={<ExpandMore />}
                                defaultExpandIcon={<ChevronRight />}
                                sx={{ height: 240, flexGrow: 1, overflowY: 'auto' }}
                            >
                                {schema.phasemetadatas.sort(comparePrerequisites).map((phasemetadata) => {
                                    return <TreeItem key={phasemetadata.id} nodeId={phasemetadata.id} label={phasemetadata.name}>
                                        {phasemetadata.objectivemetadatas.map((objectivemetadata) => {
                                            return <TreeItem key={objectivemetadata.id} nodeId={objectivemetadata.id} label={objectivemetadata.name}>
                                                {objectivemetadata.taskmetadatas.map((taskmetadata) => {
                                                    return <TreeItem key={taskmetadata.id} nodeId={taskmetadata.id} label={taskmetadata.name} />
                                                })}
                                            </TreeItem>
                                        })}
                                    </TreeItem>
                                })}

                            </TreeView>
                            <Button variant="contained" fullWidth onClick={() => submit(schema.id)}>Use this schema</Button>

                        </Card>

                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default CreateSchema;
