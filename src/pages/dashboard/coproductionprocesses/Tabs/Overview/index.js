import { Box, Button, Divider, Typography } from "@material-ui/core";
import { AssetsTable } from "components/dashboard/assets";
import useMounted from "hooks/useMounted";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { assetsApi } from "__api__";

const OverviewTab = ({ coproductionprocess, setSelectedTreeItem }) => {
    const [assets, setAssets] = useState([])
    const mounted = useMounted()
    const navigate = useNavigate()

    const { process, tasks: allTasks } = useSelector((state) => state.process);

    useEffect(() => {
        assetsApi.getMulti({ coproductionprocess_id: coproductionprocess.id }).then((res) => {
            if (mounted.current) {
                setAssets(res)
            }
        })
    }, [])

    return (
        <Box style={{ backgroundColor: "background.default", justifyContent: "center" }}>
            <Typography variant="h5" sx={{ my: 2, textAlign: "center", }} color="textSecondary">
                Recent resources
            </Typography>
            <Box sx={{ mb: 3 }}>
                <AssetsTable assets={assets} actions={(asset) => <Button variant="outlined" size="small" onClick={() => {
                    setSelectedTreeItem({ ...allTasks.find(task => task.id === asset.task_id), type: "task" })
                    navigate(`/dashboard/coproductionprocesses/${process.id}/guide`)
                }} >See task</Button>} />
            </Box>
        </Box>
    );
};

export default OverviewTab