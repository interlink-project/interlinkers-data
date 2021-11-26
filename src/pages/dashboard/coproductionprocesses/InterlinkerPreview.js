import * as React from 'react';
import {
    alpha, Box, Grid, Card,
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    DialogContentText, Skeleton, Typography, SvgIcon, List, ListItem, ListItemText, ListItemAvatar, Avatar
} from '@material-ui/core'; import { interlinkersApi } from '__fakeApi__';
import { assetsApi } from '__fakeApi__';
import useMounted from '../../../hooks/useMounted';
import { LoadingButton } from '@material-ui/lab';

export default function InterlinkerPreview({ taskinstantiationId, interlinkerId, closeCallback }) {
    const mounted = useMounted();
    const [interlinker, setInterlinker] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [creatingAsset, setCreatingAsset] = React.useState(false);

    const getInterlinker = React.useCallback(async () => {
        try {
            const data = await interlinkersApi.get(interlinkerId)

            if (mounted.current) {
                setInterlinker(data);
                setLoading(false)

            }
        } catch (err) {
            console.error(err);
        }
    }, [mounted]);

    React.useEffect(() => {
        getInterlinker();
    }, [getInterlinker]);

    const createAsset = async () => {
        setCreatingAsset(true)
        const data = await assetsApi.create(
            taskinstantiationId,
            interlinker.last_version.id
        );
        setCreatingAsset(false)
    };

    return (
        <Dialog fullWidth maxWidth="lg" open onClose={closeCallback} >
            <DialogTitle>Asset creation</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Assets are created by interlinkers. Please, select one interlinker and an asset will be created.
                </DialogContentText>

            </DialogContent>
            <DialogActions>
                <Button onClick={closeCallback}>Cancel</Button>
                <LoadingButton loading={creatingAsset} variant="contained" onClick={() => createAsset()}>Instantiate</LoadingButton>
            </DialogActions>
        </Dialog>

    );
}