import { CircularProgress, Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { interlinkersApi } from '__fakeApi__';
import InterlinkerDetails from './InterlinkerDetails';
import InterlinkerHeader from './InterlinkerHeader';
import useMounted from 'hooks/useMounted';

const InterlinkerDialog = ({ open, setOpen, interlinker }) => {
    const [data, setData] = useState(null)
    const mounted = useMounted()
    useEffect(() => {
        setData(null)

        const isObj = typeof interlinker === 'object' && !Array.isArray(interlinker) && interlinker !== null
        if (isObj) {
            setData(interlinker)
        } else {
            interlinkersApi.get(interlinker).then(res => {
                if(mounted.current){
                    setData(res)
                }
            })
        }
    }, [mounted, interlinker])

    return <Dialog fullWidth={true}
        maxWidth="lg"
        onClose={() => setOpen(false)}
        open={open}
        sx={{ py: 0 }}
    >
        {data ? <>
            <DialogTitle sx={{
                backgroundColor: 'background.default',
            }} >
                <InterlinkerHeader interlinker={data} />
            </DialogTitle>

            <DialogContent style={{ minHeight: "70vh" }} sx={{
                backgroundColor: 'background.default',
                py: 0
            }}>
                <InterlinkerDetails interlinker={data} />
            </DialogContent>
        </> : <CircularProgress />
        }
    </Dialog>
};

export default InterlinkerDialog;
