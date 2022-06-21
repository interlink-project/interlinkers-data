import { Alert, Autocomplete, Avatar, CircularProgress, Menu, MenuItem, TextField } from '@material-ui/core';
import useDependantTranslation from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import React, { useEffect, useState } from 'react';
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
            <Autocomplete
                value={null}
                onChange={(event, user) => {
                    onClick(user)
                    setInputValue("");
                }}
                fullWidth
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                open={open}
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                }}
                getOptionLabel={(option) => option.full_name || option.email}
                options={searchResults}
                loading={loading}
                renderOption={(props, option, { selected }) => (
                    <li {...props}>
                        <Avatar sx={{ mr: 2, height: 30, width: 30 }} src={option.picture} />
                        {option.full_name} {exclude.includes(option.id) && `(${t("already added")})` }
                    </li>
                )}
                getOptionDisabled={(option) => exclude.includes(option.id)}
                noOptionsText={t("No results. Try to type the complete email of the user")}
                renderInput={(params) => <TextField
                    {...params}
                    label={t("Email or name")}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />}
            />
        </>
    );
};

export default UserSearch;
