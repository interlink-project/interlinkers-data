import { Box, Button, Typography } from "@material-ui/core";
import { AssetsTable } from "components/dashboard/assets";
import useDependantTranslation from "hooks/useDependantTranslation";
import useMounted from "hooks/useMounted";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { assetsApi } from "__api__";

const RecentActivityTab = ({ coproductionprocess, setSelectedTreeItem }) => {
    const [assets, setAssets] = useState([])
    const [loadingAssets, setLoadingAssets] = useState(false)
    const mounted = useMounted()
    const navigate = useNavigate()

    const { process, tasks: allTasks } = useSelector((state) => state.process);
    const { t } = useDependantTranslation()

    useEffect(() => {
        setLoadingAssets(true)
        assetsApi.getMulti({ coproductionprocess_id: coproductionprocess.id }).then((res) => {
            if (mounted.current) {
                setAssets(res)
                setLoadingAssets(false)
            }
        })
    }, [])

    return (
        <Box sx={{ mb: 3 }}>
            <AssetsTable
                loading={loadingAssets}
                language={process.language}
                assets={assets}
                actions={(asset) => <Button variant="outlined" size="small" onClick={() => {
                    setSelectedTreeItem({ ...allTasks.find(task => task.id === asset.task_id), type: "task" })
                    navigate(`/dashboard/coproductionprocesses/${process.id}/guide`)
                }}>
                    {t("See task")}
                </Button>}
            />
        </Box>
    );
};

export default RecentActivityTab