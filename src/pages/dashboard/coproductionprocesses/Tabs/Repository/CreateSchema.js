import { Box, Card, CardHeader, Grid, Rating, Typography, Stack, CircularProgress } from '@material-ui/core';
import { ChevronRight, ExpandMore } from '@material-ui/icons';
import {
    LoadingButton, TreeItem,
    TreeView
} from '@material-ui/lab';
import useMounted from 'hooks/useMounted';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProcess } from 'slices/process';
import { topologicalSort } from 'utils/comparePrerequisites';
import { coproductionProcessesApi } from '__fakeApi__';
import { coproductionSchemasApi } from '__fakeApi__/coproduction/coproductionSchemasApi';

const sameHeightCards = {
    minHeight: "200px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
}
const CreateSchema = () => {
    const [loading, setLoading] = useState(true)
    const { process } = useSelector((state) => state.process);
    const { schemas = [], loadingSchemas } = useSelector((state) => state.general);
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


    const submit = async (coproductionschema_id) => {
        setLoading(coproductionschema_id)
        coproductionProcessesApi.setSchema(process.id, coproductionschema_id).then(process => {
            setCoproductionProcess(process)
        }).finally(() => setLoading(coproductionschema_id));
    }

    return (

        <Box sx={{ p: 2, minHeight: '87vh' }}>
            <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ mb: 2 }}>Schema selection</Typography>
                <Typography variant="subtitle1" sx={{ mb: 4 }}>An schema contains a set of phases, objectives and tasks predefined. Those items could (and should) be edited in order to adapt the workplan of your project.</Typography>
            </Box>

            {loadingSchemas ? <CircularProgress /> : <Grid container spacing={3} justifyContent="flex-start">
                {schemas.map(schema => (
                    <Grid item xs={12} md={6} lg={4} xl={3} key={schema.id}                       >
                        <Card style={sameHeightCards}>
                            <CardHeader sx={{ textAlign: "center" }} title={schema.name} subheader={
                                <Stack direction="row"
                                    justifyContent="center"
                                    alignItems="center"
                                    spacing={2}
                                >
                                    <Rating size="small" readOnly value={0} />
                                    (0)
                                </Stack>}>

                            </CardHeader>
                            <TreeView
                                aria-label="file system navigator"
                                defaultCollapseIcon={<ExpandMore />}
                                defaultExpandIcon={<ChevronRight />}
                                sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}
                            >
                                {schema.phasemetadatas.map((phasemetadata) => {
                                    return <TreeItem key={phasemetadata.id} nodeId={phasemetadata.id} label={<p><b>Phase</b>: {phasemetadata.name}</p>}>
                                        {phasemetadata.objectivemetadatas.map((objectivemetadata) => {
                                            return <TreeItem key={objectivemetadata.id} nodeId={objectivemetadata.id} label={<p><b>Objective</b>: {objectivemetadata.name}</p>}>
                                                {objectivemetadata.taskmetadatas.map((taskmetadata) => {
                                                    return <TreeItem key={taskmetadata.id} nodeId={taskmetadata.id} label={<p><b>Task</b>: {taskmetadata.name}</p>} />
                                                })}
                                            </TreeItem>
                                        })}
                                    </TreeItem>
                                })}

                            </TreeView>
                            <LoadingButton loading={loading === schema.id} variant="contained" fullWidth onClick={() => submit(schema.id)}>Use this schema</LoadingButton>

                        </Card>

                    </Grid>
                ))}
            </Grid>}

        </Box>
    );
};

export default CreateSchema;
