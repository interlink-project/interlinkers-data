import { CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, Skeleton } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { interlinkersApi } from '__api__';
import InterlinkerDetails from './InterlinkerDetails';
import InterlinkerHeader from './InterlinkerHeader';
import useMounted from 'hooks/useMounted';
import { Close } from '@material-ui/icons';

const InterlinkerDialog = ({ language, open, setOpen, interlinker }) => {
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
                m: 0, p: 2, 
                backgroundColor: 'background.default',
            }} >
                <InterlinkerHeader language={language} interlinker={data} />
                <IconButton
        aria-label="close"
        onClick={() => setOpen(false)}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <Close />
      </IconButton>
            </DialogTitle>

            <DialogContent style={{ minHeight: "70vh" }} sx={{
                backgroundColor: 'background.default',
                py: 0
            }}>
                <InterlinkerDetails language={language} interlinker={data} />
            </DialogContent>
        </> : <CircularProgress />
        }
    </Dialog>
};

export default InterlinkerDialog;
