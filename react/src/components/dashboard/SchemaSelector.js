import { Alert, Box, Button, Chip, Grid, Rating, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import { ArrowBack, ArrowForward, RemoveRedEye } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import CentricCircularProgress from 'components/CentricCircularProgress';
import { InterlinkerResults } from 'components/dashboard/interlinkers';
import { PhaseTabs, StyledTree } from 'components/dashboard/tree';
import SearchBox from 'components/SearchBox';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import { truncate } from 'lodash';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProcess } from 'slices/process';
import { getLocalizedDate } from 'utils/moment';
import { topologicalSort } from 'utils/topologicalSort';
import { coproductionProcessesApi, coproductionSchemasApi } from '__api__';

const CreateSchema = () => {
    const [instantiatingSchema, setInstantiatingSchema] = React.useState(null)
    const [loading, setLoading] = React.useState(true)
    const [selectedSchema, setSelectedSchema] = React.useState(null)
    const [rows, setRows] = React.useState([])
    const { process } = useSelector((state) => state.process);
    const dispatch = useDispatch()
    const mounted = useMounted();
    const t = useCustomTranslation(process.language)

    const [selectedPhaseTab, setSelectedPhaseTab] = React.useState(null)
    const [selectedTreeItem, setSelectedTreeItem] = React.useState(null)
    const [inputValue, setInputValue] = React.useState("");

    const update = () => {
        setLoading(true)
        coproductionSchemasApi.getMulti({ search: inputValue }, process.language).then(res => {
            if (mounted.current) {
                setRows(res.items)
                setLoading(false)
            }
        });
    }

    React.useEffect(() => {
        var delayDebounceFn
        if (mounted.current) {
            delayDebounceFn = setTimeout(() => {
                update()
            }, 800)
        }
        return () => {
            if (delayDebounceFn) {
                clearTimeout(delayDebounceFn)
            }
        }
    }, [inputValue])

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
        setInstantiatingSchema(true)
        coproductionProcessesApi.setSchema(process.id, coproductionschema_id, process.language).then(process => {
            if (mounted.current) {
                setCoproductionProcess(process)
            }
        });
    }

    const schemaword = t("schema")

    const handleClose = () => {
        setSelectedPhaseTab(null)
        setSelectedSchema(null)
    }

    return <TableContainer sx={{ height: "100%" }}>
        {!selectedSchema ?
            <>
                <Box sx={{ textAlign: "center", my: 3 }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>{t("schema-selection-title")}</Typography>
                </Box>
                <SearchBox language={process.language} loading={loading} inputValue={inputValue} setInputValue={setInputValue} />

                <Table sx={{ minWidth: 400 }} aria-label="coproduction schemas table" >
                    <TableHead>
                        <TableRow>
                            <TableCell width="20%" align='center'>{t("Name")}</TableCell>
                            <TableCell width="50%" align='center'>{t("Description")}</TableCell>
                            <TableCell width="15%" align='center'>{t("Creation date")}</TableCell>
                            <TableCell width="15%" align='center'>{t("Actions")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {!loading && rows.map((row, index) => (
                            <TableRow key={row.name}>
                                <TableCell width="20%" component="th" scope="row" sx={{ textAlign: "center" }}>
                                    <Typography sx={{ fontWeight: "bold" }}>
                                        #{index + 1} {row.name}
                                    </Typography>
                                    <Stack justifyContent="center" direction="row" alignItems="center">
                                        <Rating size="small" readOnly value={row.rating} />
                                        <Typography variant="body1">
                                            ({row.ratings_count})
                                        </Typography>
                                    </Stack>

                                </TableCell>
                                <TableCell width="50%">
                                    {truncate(row.description, {
                                        length: 1000,
                                        separator: ' ',
                                    })}
                                </TableCell>
                                <TableCell width="15%">
                                    {getLocalizedDate(process.language, row.created_at).fromNow()}
                                </TableCell>
                                <TableCell width="15%">
                                    <Button variant="contained" startIcon={<RemoveRedEye />} onClick={() => {
                                        setSelectedPhaseTab(topologicalSort(row.phasemetadatas)[0]);
                                        setSelectedSchema(row);
                                    }}>{t("Preview")}</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table></>
            :
            <>
                <Alert severity="warning" action={
                    <>
                        <LoadingButton sx={{ mr: 2 }} startIcon={<ArrowBack />} variant="contained" color="error" onClick={handleClose}>{t("Go back")}</LoadingButton>
                        <LoadingButton endIcon={<ArrowForward />} loading={instantiatingSchema} variant="contained" onClick={() => submit(selectedSchema.id)}>{t("use-what", { what: schemaword })}</LoadingButton>
                    </>
                }>{t("this-is-a-preview")}</Alert>

                {instantiatingSchema ?
                    <CentricCircularProgress language={process.language} />
                    :
                    <>
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
                                    {selectedTreeItem.type === "task" && <>
                                        <Typography variant="h6" sx={{ mt: 3 }}>
                                            {t("Problem profiles")}
                                        </Typography>
                                        <p style={{
                                            whiteSpace: 'pre-wrap',
                                            marginTop: 0
                                        }}>{selectedTreeItem.problemprofiles.map(pp => <Chip sx={{ mr: 1, mt: 1 }} label={pp.id + " - " + pp.name} key={`task-problemprofile-${pp.id}`} />)}</p>
                                        <InterlinkerResults defaultMode="list" defaultSize={5} language={process.language} filters={{ problemprofiles: selectedTreeItem.problemprofiles.map(pp => pp.id) }} onInterlinkerClick={(interlinker) => { }} />
                                    </>}
                                </Box>}
                            </Grid>
                        </Grid>
                    </>}
            </>}
    </TableContainer>
};

export default CreateSchema;
