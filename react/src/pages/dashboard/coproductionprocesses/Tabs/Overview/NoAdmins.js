import { Box } from '@material-ui/core';
import { AccountTree, OpenInNew } from '@material-ui/icons';
import { AssetsTable } from 'components/dashboard/assets';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { setSelectedTreeItemById } from 'slices/process';
import { coproductionProcessesApi } from '__api__';

export default function NoAdmins({ }) {
    const { process } = useSelector((state) => state.process);
    const [loading, setLoading] = React.useState(true)
    const [assets, setAssets] = React.useState([])
    const mounted = useMounted()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const t = useCustomTranslation(process.language)

    React.useEffect(() => {
        setLoading(true)
        coproductionProcessesApi.getAssets(process.id).then(res => {
            if (mounted.current) {
                setAssets(res)
                setLoading(false)
            }
        })
    }, [process])

    const getAssetsActions = (asset) => {
        const actions = []
        actions.push({
            id: `${asset.id}-open-action`,
            onClick: (closeMenuItem) => {
                window.open(asset.link + "/view", "_blank")
                closeMenuItem()
            },
            text: t("Open"),
            icon: <OpenInNew fontSize="small" />
        })
        actions.push({
            id: `${asset.id}-open-task-action`,
            onClick: (closeMenuItem) => {
                dispatch(setSelectedTreeItemById(asset.task_id, () => {
                    navigate(`/dashboard/coproductionprocesses/${process.id}/guide`);
                }))
            },
            text: t("Go to the task"),
            icon: <AccountTree fontSize="small" />
        })
        return actions
    }

    return <Box sx={{ p: 3, justifyContent: "center" }}>
        <AssetsTable language={process.language} loading={loading} assets={assets} getActions={getAssetsActions} />
    </Box>
}