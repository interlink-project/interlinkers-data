import { Backdrop, Box, Card, CardHeader, CircularProgress, Grid, Rating, Stack, Typography } from '@material-ui/core';
import { ChevronRight, ExpandMore } from '@material-ui/icons';
import {
    LoadingButton, TreeItem,
    TreeView
} from '@material-ui/lab';
import useDependantTranslation from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProcess } from 'slices/process';
import { topologicalSort } from 'utils/comparePrerequisites';
import { coproductionProcessesApi } from '__api__';
import { coproductionSchemasApi } from '__api__/catalogue/coproductionSchemasApi';

const sameHeightCards = {
    minHeight: "200px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
}
const CreateSchema = () => {
    const [loadingSchemaId, setLoadingSchemaId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [schemas, setSchemas] = useState([])
    const { process } = useSelector((state) => state.process);
    const dispatch = useDispatch()
    const mounted = useMounted();
    const t = useDependantTranslation()

    const getSchemas = async () => {
        coproductionSchemasApi.getPublic(process.language).then(res => {
            if (mounted) {
                setSchemas(res.map(schema => ({ ...schema, phasemetadatas: topologicalSort(schema.phasemetadatas) })))
                setLoading(false)
            }
        });
    }

    useEffect(() => {
        getSchemas()
    }, [])

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
        setLoadingSchemaId(coproductionschema_id)
        coproductionProcessesApi.setSchema(process.id, coproductionschema_id, process.language).then(process => {
            setCoproductionProcess(process)
        });
    }

    const schemaword = t("schema")

    return (

        <Box sx={{ p: 2, minHeight: '87vh' }}>
            <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ mb: 2 }}>{t("schema-selection-title")}</Typography>
                <Typography variant="subtitle1" sx={{ mb: 4 }}>{t("schema-selection-description")}</Typography>
            </Box>
            {loading ? <CircularProgress /> : <Grid container spacing={3} justifyContent="flex-start">
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
                                    return <TreeItem key={phasemetadata.id} nodeId={phasemetadata.id} label={<p><b>{t("Phase")}</b>: {phasemetadata.name}</p>}>
                                        {phasemetadata.objectivemetadatas.map((objectivemetadata) => {
                                            return <TreeItem key={objectivemetadata.id} nodeId={objectivemetadata.id} label={<p><b>{t("Objective")}</b>: {objectivemetadata.name}</p>}>
                                                {objectivemetadata.taskmetadatas.map((taskmetadata) => {
                                                    return <TreeItem key={taskmetadata.id} nodeId={taskmetadata.id} label={<p><b>{t("Task")}</b>: {taskmetadata.name}</p>} />
                                                })}
                                            </TreeItem>
                                        })}
                                    </TreeItem>
                                })}

                            </TreeView>
                            <LoadingButton loading={loadingSchemaId === schema.id} variant="contained" fullWidth onClick={() => submit(schema.id)}>{t("use", { what: schemaword })}</LoadingButton>

                        </Card>

                    </Grid>
                ))}
                <Backdrop open={loadingSchemaId} >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Grid>}

        </Box>
    );
};

export default CreateSchema;
