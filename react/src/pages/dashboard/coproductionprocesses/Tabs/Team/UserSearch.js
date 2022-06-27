import { Alert, Avatar, LinearProgress, List, ListItemAvatar, ListItem, ListItemText, Paper, TextField, Typography } from '@material-ui/core';
import useDependantTranslation from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { usersApi } from '__api__';

const UserSearch = ({ exclude = [], onClick, organization_id = null }) => {
    const [loading, setLoading] = useState(false);
    const mounted = useMounted();
    const [searchResults, setSearchResults] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const { t } = useDependantTranslation()
    const [open, setOpen] = useState(false);

    useEffect(() => {
        var delayDebounceFn
        if (mounted && inputValue) {
            setLoading(true)
            setOpen(false)
            delayDebounceFn = setTimeout(() => {
                usersApi.search(inputValue, organization_id).then(res => {
                    if (mounted.current) {
                        setSearchResults(res)
                    }
                }).catch(() => {
                    if (mounted.current) {
                        setSearchResults([])
                    }
                }).finally(() => {
                    if (mounted.current) {
                        setLoading(false)
                    }
                    setOpen(true)
                })
            }, 1000)
        }
        return () => {
            clearTimeout(delayDebounceFn)
            setLoading(false)
        }
    }, [mounted, inputValue])

    return (
        <>
            <Alert severity='warning' sx={{ my: 2 }}>{t("Only registered users can be added")}</Alert>
            <TextField fullWidth value={inputValue} onChange={(event) => {
                setInputValue(event.target.value);
            }} id="outlined-basic" variant="outlined" />
            {loading && <LinearProgress />}
            {open && <Paper>
                {searchResults.length === 0 ? <Typography sx={{p:2}} variant="body1">
                    {t("No results. Try to type the complete email of the user")}
                </Typography>
                    :
                    <List>
                        {searchResults.slice(0, 4).map(user => {
                            const alreadySelected = exclude.includes(user.id)
                        return <>
                            <ListItem disabled={alreadySelected} sx={{cursor: 'pointer' }} onClick={(event) => {
                                setOpen(false)
                                onClick(user)
                                setInputValue("");
                            }}>
                                <ListItemAvatar>
                                    <Avatar sx={{ mr: 2, height: 30, width: 30 }} src={user.picture} />
                                </ListItemAvatar>
                                <ListItemText 
                                primary={user.full_name + (alreadySelected ? ` (${t("already added")})` : "")} 
                                    secondary={t("Last login") + ": " + moment(user.last_login).fromNow()} />
                            </ListItem>
                        </>})}
                    </List>}

            </Paper>}


        </>
    );
};

export default UserSearch;
