import { Alert, TextField } from '@material-ui/core';
import { Cancel, CheckCircle } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import useDependantTranslation from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import { useEffect, useState } from 'react';
import { usersApi } from '__api__';

const UserSearch = ({ text, onClick }) => {
    const [loading, setLoading] = useState(false);
    const mounted = useMounted();
    const [individualSearchResult, setResultIndividualSearch] = useState(null);
    const [emailValue, setEmailValue] = useState("");
    const t = useDependantTranslation()

    useEffect(() => {
        var delayDebounceFn
        if (mounted && emailValue) {
            setLoading(true)
            delayDebounceFn = setTimeout(() => {
                usersApi.get(emailValue).then(res => {
                    if (mounted.current) {
                        setResultIndividualSearch(res.data)
                        console.log(res.data)
                    }

                }).catch(() => {
                    if (mounted.current) {
                        setResultIndividualSearch(null)
                    }
                }).finally(() => {
                    if (mounted.current) {
                        setLoading(false)

                    }
                })
            }, 1000)
        }
        return () => {
            clearTimeout(delayDebounceFn)
            setLoading(false)
        }
    }, [mounted, emailValue])

    return (
        <>
            <Alert severity='warning' sx={{my: 2}}>{t("Only registered users can be added")}</Alert>
            <TextField
                margin="dense"
                label={t("Email")}
                type="email"
                fullWidth
                variant="standard"
                value={emailValue}
                onChange={(e) => {
                    setEmailValue(e.target.value)
                }}
            />
            <LoadingButton loading={loading} fullWidth variant="text" color='primary' onClick={() => onClick(individualSearchResult)}
                disabled={!individualSearchResult}
                endIcon={individualSearchResult ? <CheckCircle /> : emailValue && <Cancel color='error' />}
                sx={{ mt: 1 }}
            >{text}</LoadingButton>
        </>
    );
};

export default UserSearch;
