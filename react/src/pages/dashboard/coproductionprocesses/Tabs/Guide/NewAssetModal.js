import {
    Box,
    Button, Dialog, DialogActions, DialogContent,
    DialogTitle, Grid, IconButton
} from '@material-ui/core';
import { ArrowBack, Close, DoubleArrow, Download, Preview } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import CentricCircularProgress from 'components/CentricCircularProgress';
import { InterlinkerDetails, InterlinkerHeader } from 'components/dashboard/interlinkers';
import { REACT_APP_DOMAIN } from 'configuration';
import useDependantTranslation from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { assetsApi } from '__api__';

export default function NewAssetModal({ open, handleUserClose, handleFinish, activeStep, setStep, selectedInterlinker, treeitem, onCreate }) {
    const { process } = useSelector((state) => state.process);
    const { t } = useDependantTranslation()

    const [loadingInstantiator, setLoadingInstantiator] = useState(true);
    const [assetData, setAssetData] = useState(null);
    const [loadingKnowledgeInstantiation, setLoadingKnowledgeInstantiation] = useState(false);

    // if software interlinker, helper bools
    const isSoftware = selectedInterlinker.nature === "softwareinterlinker"
    const isKnowledge = selectedInterlinker.nature === "knowledgeinterlinker"
    const isExternal = selectedInterlinker.nature === "externalsoftwareinterlinker" || selectedInterlinker.nature === "externalknowledgeinterlinker"
    const can_open_in_modal = isSoftware && selectedInterlinker.open_in_modal

    // if knowledgeinterlinker is previewable
    const previewable = isKnowledge && selectedInterlinker.softwareinterlinker.preview
    const downloadable = isKnowledge && selectedInterlinker.softwareinterlinker.download
    const instantiatable = (isSoftware && selectedInterlinker.instantiate) || (isKnowledge && selectedInterlinker.softwareinterlinker.instantiate)

    const mounted = useMounted()

    const onFinish = (result) => {
        setAssetData(result)
        setStep(2)
        onCreate()
    }

    async function onMessage(event) {
        // Check sender origin to be trusted
        console.log(event.origin, REACT_APP_DOMAIN, event.origin.length <= 0 || !event.origin.includes(REACT_APP_DOMAIN), event ? event.data : "not found")
        if (event.origin.length <= 0 || !event.origin.includes(REACT_APP_DOMAIN)) return;
        const { code, message } = event.data
        if (code === "initialized") {
            setLoadingInstantiator(false)
        }
        if (code === "asset_created") {
            //task_id, interlinker_id, external_asset_id
            const coproduction_asset = await assetsApi.create_internal(
                treeitem.id,
                selectedInterlinker.id,
                message.id || message._id,
            );

            // TODO: if fails
            const interlinker_asset = await assetsApi.getInternal(coproduction_asset.id)
            onFinish({ ...coproduction_asset, ...interlinker_asset })
        }
    }

    useEffect(() => {
        // https://stackoverflow.com/questions/2161388/calling-a-parent-window-function-from-an-iframe

        const doAsync = async () => {
            if (activeStep === 0) {
                setAssetData(null)
                setStep(0)
                setLoadingInstantiator(false)
            }
            if (activeStep === 1) {
                if (isSoftware) {
                    // Initiate listeners if is an internally Internal software interlinker
                    if (window.addEventListener) {  // all browsers except IE before version 9
                        window.addEventListener("message", onMessage, false);
                    }
                    else if (window.attachEvent) {
                        window.attachEvent("onmessage", onMessage, false);
                    }

                    // if cannot be opened in a modal, open a window
                    if (!can_open_in_modal) {
                        window.open(`${selectedInterlinker.backend}/instantiate`)
                    } else {
                        setLoadingInstantiator(true)
                    }
                }
                else if (isKnowledge) {
                    // if knowledgeinterlinker
                    setLoadingKnowledgeInstantiation(true)
                    const interlinker_asset = await assetsApi.instantiate(selectedInterlinker.id, treeitem.id, process.language)
                    setLoadingKnowledgeInstantiation(false)

                    // TODO: if fails
                    onFinish(interlinker_asset)
                }
                if (isExternal) {
                    window.open(selectedInterlinker.uri)
                }
            }
            if (activeStep === 2) {
                // && isKnowledge
                handleFinish()
            }
        }
        if (mounted.current) {
            doAsync()
        }
        return () => {
            if (window.addEventListener) {
                window.removeEventListener("message", onMessage, false);
            }
            else if (window.attachEvent) {
                window.attachEvent("onmessage", onMessage, false);
            }
        }
    }, [activeStep, selectedInterlinker]);

    const getHeight = () => {
        if (activeStep === 0) {
            return "70vh"
        }
        if (activeStep === 1) {
            return isSoftware ? "70vh" : "50vh"
        }
        return "40vh"
    }

    return (
        <Dialog
            fullWidth
            maxWidth="lg"
            open={open}
            onClose={handleUserClose}

        >
            <DialogTitle sx={{
                alignItems: "center",
                backgroundColor: 'background.default',
                pb: 0
            }}>

                <Grid container spacing={2}>
                    <Grid item xs={1}>
                        {activeStep > 0 && <IconButton children={<ArrowBack />} onClick={() => setStep(activeStep - 1)} />}
                    </Grid>
                    <Grid item xs={10}>
                        {activeStep === 0 && <InterlinkerHeader language={process.language} interlinker={selectedInterlinker} />}
                    </Grid>
                    <Grid item xs={1} style={{ textAlign: "right" }}>
                        <IconButton children={<Close />} onClick={handleUserClose} />
                    </Grid>
                </Grid>

            </DialogTitle>

            <DialogContent style={{ minHeight: getHeight() }} sx={{
                alignItems: "center",
                backgroundColor: 'background.default'
            }}>
                {activeStep === 0 && <Box>
                    <InterlinkerDetails language={process.language} interlinker={selectedInterlinker} />
                </Box>}

                {activeStep === 1 && isSoftware && <Box>
                    {/* If software interlinker */}
                    {can_open_in_modal ?
                        <>
                            {loadingInstantiator && <CentricCircularProgress language={process.language} />}
                            <iframe style={{ display: loadingInstantiator ? "none" : "block" }} src={`${selectedInterlinker.backend}/instantiate`} style={{ width: "100%", minHeight: "60vh", border: 0 }}></iframe>
                        </> :
                        <CentricCircularProgress language={process.language} onCancel={() => setStep(0)} />
                    }
                </Box>}
                {activeStep === 1 && isKnowledge && <Box>
                    <CentricCircularProgress language={process.language} />
                </Box>}
            </DialogContent>
            {activeStep === 0 && <DialogActions sx={{ bgcolor: "background.default", justifyContent: "center" }}>
                {previewable && <Button startIcon={<Preview />} sx={{ my: 2, mx: 4 }} autoFocus variant="outlined" color="warning" onClick={() => window.open(selectedInterlinker.link + "/preview", "_blank")}>
                    {selectedInterlinker.softwareinterlinker.preview_text} {t("(it will be not related to project but it is useful for features exploration)")}
                </Button>}
                {downloadable && <Button startIcon={<Download />} sx={{ my: 2, mx: 4 }} autoFocus variant="outlined" color="warning" onClick={() => window.open(selectedInterlinker.link + "/download", "_blank")}>
                    {t("Download locally as resource not related to project (for features exploration)")}
                </Button>}
                {instantiatable && <LoadingButton loading={loadingKnowledgeInstantiation} startIcon={<DoubleArrow />} sx={{ my: 2, mx: 4 }} autoFocus variant="contained" onClick={() => setStep(1)}>
                    {t("Instantiate as resource to use in project")}
                </LoadingButton>}
                {isExternal && <Button startIcon={<DoubleArrow />} sx={{ my: 2, mx: 4 }} disabled={!selectedInterlinker.uri} autoFocus variant="contained" onClick={() => window.open(selectedInterlinker.uri, "_blank")}>{t("Open the external resource on a new tab")}</Button>}
            </DialogActions>}
        </Dialog>
    );
}