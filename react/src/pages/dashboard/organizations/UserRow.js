import { Avatar, CircularProgress, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Skeleton, TableCell, TableRow } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import useAuth from 'hooks/useAuth';
import useMounted from 'hooks/useMounted';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { usersApi } from '__api__';

const MyMenuItem = ({ onClick, text, icon, id, disabled = false, loading = false }) => {
    return <MenuItem aria-describedby={id} onClick={onClick} disabled={disabled}>
        <ListItemIcon>
            {loading === id ? <CircularProgress /> : icon}
        </ListItemIcon>
        <ListItemText>{text}</ListItemText>
    </MenuItem>
}
const UserRow = ({ t, user, actions, showLastLogin, size=30 }) => {
    const { user: auth_user } = useAuth();
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(null)
    const mounted = useMounted();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleActionsClose = () => {
        setAnchorEl(null);
    };

    const handleActionsClick = (event) => {
        event.stopPropagation();
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };

    useEffect(() => {
        setData(user)
        return
        setLoading(true)
        usersApi.get(user.id).then(res => {
            if (mounted.current) {
                setData(res.data)
                setLoading(false)
            }
        })
    }, [user])

    const you = user.id === auth_user.sub

    return <TableRow
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
        {!data ? <>
            <TableCell component="th" scope="row" colSpan={5}>
                <Skeleton />
            </TableCell>
        </> : <>
            <TableCell component="th" scope="row">
                <Avatar sx={{height: size, width: size}} src={data.picture} />
            </TableCell>
            <TableCell>{data.full_name}{you && <> ({t("you")})</>}</TableCell>
            <TableCell>{data.email}</TableCell>
            {showLastLogin && <TableCell>{moment(data.last_login).fromNow()}</TableCell>}
            {actions && <TableCell align="center">
                <IconButton aria-label="settings" id="basic-button"
                    aria-controls="basic-menu"
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleActionsClick}
                >
                    <MoreVert />
                </IconButton>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleActionsClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    {actions.map(({ id, onClick, icon, disabled, text }) => <MyMenuItem key={id} id={id} disabled={disabled} onClick={() => {onClick(user); handleActionsClose()}} text={text} icon={icon} />)}
                </Menu>
            </TableCell>}
        </>}
    </TableRow>
}

export default UserRow;
