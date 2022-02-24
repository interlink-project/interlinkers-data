import { useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Typography,
} from '@material-ui/core';
import CogIcon from '../../icons/Cog';
import UserIcon from '../../icons/User';
import useAuth from '../../hooks/useAuth';
import { Login } from '@material-ui/icons';

const AccountPopover = () => {
  const anchorRef = useRef(null);
  const auth = useAuth();
  const { user, isAuthenticated } = auth;
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      handleClose();
      auth.logout();
    } catch (err) {
      console.error(err);
      toast.error('Unable to logout.');
    }
  };

  return isAuthenticated ? (
    <>
      <Box
        component={ButtonBase}
        onClick={handleOpen}
        ref={anchorRef}
        sx={{
          alignItems: 'center',
          display: 'flex',
        }}
      >
        <Avatar
          src={user.picture}
          sx={{
            height: 32,
            width: 32,
          }}
        />
      </Box>
      <Popover
        anchorEl={anchorRef.current}
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'bottom',
        }}
        keepMounted
        onClose={handleClose}
        open={open}
        PaperProps={{
          sx: { width: 240 },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            color='textPrimary'
            variant='subtitle2'
          >
            {user.full_name}
          </Typography>
          <Typography
            color='textSecondary'
            variant='subtitle2'
          >
            {user.email}
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ mt: 2 }}>
          <MenuItem
            component={RouterLink}
            to='/dashboard/social/profile'
          >
            <ListItemIcon>
              <UserIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText
              primary={(
                <Typography
                  color='textPrimary'
                  variant='subtitle2'
                >
                  Profile
                </Typography>
              )}
            />
          </MenuItem>
          <MenuItem
            component={RouterLink}
            to='/dashboard/account'
          >
            <ListItemIcon>
              <CogIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText
              primary={(
                <Typography
                  color='textPrimary'
                  variant='subtitle2'
                >
                  Settings
                </Typography>
              )}
            />
          </MenuItem>
        </Box>
        <Box sx={{ p: 2 }}>
          <Button
            color='primary'
            fullWidth
            onClick={handleLogout}
            variant='outlined'
          >
            Logout
          </Button>
        </Box>
      </Popover>
    </>
  ) : <Box
    component={ButtonBase}
    sx={{
      alignItems: 'center',
      display: 'flex',
    }}
    onClick={() => auth.signinRedirect()}
  >
    <Typography sx={{ mr: 1 }} variant="overline">Log in</Typography>
    <Login />
  </Box>;
};

export default AccountPopover;
