import { TextField } from '@material-ui/core';
import { Cancel, CheckCircle } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import useMounted from 'hooks/useMounted';
import { useEffect, useState } from 'react';
import { usersApi } from '__api__';

const UserSearch = ({ text, onClick }) => {
    const [loading, setLoading] = useState(false);
    const mounted = useMounted();
    const [individualSearchResult, setResultIndividualSearch] = useState(null);
    const [emailValue, setEmailValue] = useState("");

    useEffect(() => {
        var delayDebounceFn
        if (mounted && emailValue) {
            setLoading(true)
            delayDebounceFn = setTimeout(() => {
                usersApi.get(emailValue).then(res => {
                    if (mounted) {
                        setResultIndividualSearch(res.data)
                        console.log(res.data)
                    }

                }).catch(() => {
                    if (mounted) {
                        setResultIndividualSearch(null)
                    }
                }).finally(() => {
                    if (mounted) {
                        setLoading(false)

                    }
                })
            }, 1000)
        }
        return () => clearTimeout(delayDebounceFn)
    }, [mounted, emailValue])

    return (
        <>
            <TextField
                margin="dense"
                label="Email Address"
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
