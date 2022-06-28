import { Alert, Avatar, LinearProgress, Menu, MenuItem, Paper, TextField } from '@material-ui/core';
import useDependantTranslation from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import { useEffect, useRef, useState } from 'react';
import { usersApi } from '__api__';

const UserSearch = ({ exclude = [], onClick, organization_id = null }) => {
    const [loading, setLoading] = useState(false);
    const mounted = useMounted();
    const [searchResults, setSearchResults] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [open, setOpen] = useState(false);
    const { t } = useDependantTranslation()
    const [anchorEl, setAnchorEl] = useState(null);
    const textInput = useRef(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
        setOpen(false)
    };

    useEffect(() => {
        if (open && textInput.current) {
            textInput.current.focus();
        }
    }, [open])

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
            <TextField fullWidth value={inputValue} inputRef={textInput} onChange={(event) => {
                setOpen(false)
                setInputValue(event.target.value);
                handleClick(event)
            }} id="outlined-basic" variant="outlined" />
            {loading && <LinearProgress />}
            {open && <Paper>
                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    {searchResults.length === 0 ?
                        <MenuItem disabled>
                            {t("No results. Try to type the complete email of the user")}
                        </MenuItem>
                        : open && searchResults.slice(0, 4).map(user => {
                            const alreadySelected = exclude.includes(user.id)
                            return <MenuItem disabled={alreadySelected} onClick={(event) => {
                                onClick(user)
                                setInputValue("");
                                handleClose()
                            }}>
                                <Avatar sx={{ mr: 2, height: 30, width: 30 }} src={user.picture} />
                                {user.full_name + (alreadySelected ? ` (${t("already added")})` : "")}
                            </MenuItem>
                        })}
                </Menu>
            </Paper>}
        </>
    );
};

export default UserSearch;
