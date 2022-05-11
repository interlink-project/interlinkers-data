import { Box, Button, Dialog, DialogContent, Grid, Rating, Skeleton, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { StyledTree } from 'components/dashboard/tree';
import useDependantTranslation from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import { truncate } from 'lodash';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProcess } from 'slices/process';
import { topologicalSort } from 'utils/comparePrerequisites';
import { coproductionProcessesApi, coproductionSchemasApi } from '__api__';
import PhaseTabs from '../PhaseTabs';

const CreateSchema = () => {
    const [loadingSchemaId, setLoadingSchemaId] = React.useState(null)
    const [loading, setLoading] = React.useState(true)
    const [selectedSchema, setSelectedSchema] = React.useState(null)
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [rows, setRows] = React.useState([])
    const { process } = useSelector((state) => state.process);
    const dispatch = useDispatch()
    const mounted = useMounted();
    const t = useDependantTranslation()

    const [selectedPhaseTab, setSelectedPhaseTab] = React.useState(null)
    const [selectedTreeItem, setSelectedTreeItem] = React.useState(null)

    React.useEffect(() => {
        setLoading(true)
        coproductionSchemasApi.getPublic(process.language).then(res => {
            if (mounted) {
                setRows(res)
                setLoading(false)
            }
        });
    }, [])

    const setCoproductionProcess = React.useCallback(async (process) => {
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

    return <TableContainer sx={{ height: "100%" }}>
        <Box sx={{ textAlign: "center", my: 3 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>{t("schema-selection-title")}</Typography>
            <Typography variant="subtitle1" sx={{ mb: 4 }}>{t("schema-selection-description")}</Typography>
        </Box>
        {!loading ? <Table sx={{ minWidth: 500 }} aria-label="coproduction schemas table">
            <TableBody>
                {rows.map((row) => (
                    <TableRow key={row.name}>
                        <TableCell style={{ width: 160 }} component="th" scope="row" sx={{ textAlign: "center" }}>
                            <Typography sx={{ fontWeight: "bold" }}>
                                {row.name}
                            </Typography>
                            <Rating size="small" readOnly value={row.rating} sx={{ mt: 2 }} />
                            ({row.ratings_count})
                        </TableCell>
                        <TableCell>
                            {truncate(row.description, {
                                length: 1000,
                                separator: ' ',
                            })}
                        </TableCell>
                        <TableCell>
                            <Button variant="contained" onClick={() => {
                                setSelectedPhaseTab(topologicalSort(row.phasemetadatas)[0]);
                                setSelectedSchema(row);
                                setDialogOpen(true)
                            }}>{t("Preview")}</Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>

        </Table> : <Skeleton sx={{ height: "100%" }} />}
        <Dialog open={dialogOpen} fullWidth maxWidth="lg" onClose={() => {
            setDialogOpen(false)
            setSelectedPhaseTab(null)
            setSelectedSchema(null)
        }}>
            <DialogContent sx={{ p: 5 }}>

                {selectedSchema && <>

                        <Typography variant="h5"  sx={{ mb: 3 }}>
                            {selectedSchema.name}
                        </Typography>
                    <PhaseTabs phases={selectedSchema.phasemetadatas} selectedPhaseTabId={selectedPhaseTab && selectedPhaseTab.id} onSelect={(value) => {
                        setSelectedPhaseTab(value)
                        setSelectedTreeItem(value)
                    }} />
                    <Grid container>
                        <Grid item xl={4} lg={4} md={6} xs={12}>
                            <StyledTree phase={selectedPhaseTab} selectedTreeItem={selectedTreeItem} setSelectedTreeItem={setSelectedTreeItem} objectives_key="objectivemetadatas" tasks_key="taskmetadatas" />

                        </Grid>
                        <Grid item xl={8} lg={8} md={6} xs={12}>
                            {selectedTreeItem && <Box sx={{ p: 3 }}>

                                <Typography variant="h6">
                                    {t("Name")}
                                </Typography>
                                <Typography>
                                    {selectedTreeItem.name}
                                </Typography>
                                <Typography variant="h6" sx={{ mt: 3 }}>
                                    {t("Description")}
                                </Typography>
                                <Typography>
                                    {selectedTreeItem.description}
                                </Typography>
                            </Box>}
                        </Grid>

                    </Grid>
                    <LoadingButton loading={loadingSchemaId === selectedSchema.id} variant="contained" fullWidth onClick={() => submit(selectedSchema.id)}>{t("use-what", { what: schemaword })}</LoadingButton>
                </>}
            </DialogContent>

        </Dialog>
    </TableContainer>
};

export default CreateSchema;
