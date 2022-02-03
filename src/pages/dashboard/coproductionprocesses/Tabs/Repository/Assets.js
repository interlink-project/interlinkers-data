import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Button,
  Card,
  Skeleton,
  Avatar,
  Alert,
  alpha,
  IconButton,
  InputBase,
  CardActionArea,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  List,
  ListItemAvatar,
  ListItem,
  ListItemSecondaryAction
} from '@material-ui/core';
import { styled } from '@material-ui/styles';
import { MoreVert as MoreVertIcon, Search as SearchIcon, OpenInNew, Edit, CopyAll, Delete } from '@material-ui/icons';
import moment from 'moment';
import axiosInstance from 'axiosInstance';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));


const Assets = ({ assets }) => {

  const Asset = ({ asset }) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      event.stopPropagation();
      event.preventDefault();
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    useEffect(async () => {
      const res = await axiosInstance.get(asset.link)
      setData(res.data)
      setLoading(false)
    }, [])

    const MyMenuItem = ({ onClick, text, icon }) => <MenuItem onClick={onClick}>
      <ListItemIcon>
        {icon}
      </ListItemIcon>
      <ListItemText>{text}</ListItemText>
    </MenuItem>

    return data ? <CardActionArea onClick={() => window.open(data.viewLink, "_blank")}><ListItem>
      <ListItemAvatar>
        <Avatar aria-label="icon" src={data.icon} sx={{ width: 30, height: 30 }} />
      </ListItemAvatar>
      <ListItemText
        primary={data.name}
        secondary={<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom> {moment(data.createdAt).fromNow()} </Typography>}
      />
      <ListItemSecondaryAction>
        <><IconButton aria-label="settings" id="basic-button"
          aria-controls="basic-menu"
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            {data.viewLink && <MyMenuItem onClick={() => window.open(data.viewLink, "_blank")} text="View" icon={<OpenInNew fontSize="small" />} />}
            {data.editLink && <MyMenuItem onClick={() => window.open(data.editLink, "_blank")} text="Edit" icon={<Edit fontSize="small" />} />}
            {data.cloneLink && <MyMenuItem onClick={() => window.open(data.viewLink, "_blank")} text="Clone" icon={<CopyAll fontSize="small" />} />}
            <MyMenuItem onClick={() => window.open(data.viewLink, "_blank")} text="Delete" icon={<Delete fontSize="small" />} />
          </Menu></>
      </ListItemSecondaryAction>
    </ListItem></CardActionArea> : <Skeleton animation="wave" height={60} />
  }
  return <>
    <Paper>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search' }}
        />
      </Search>
    </Paper>

    {assets && assets.length > 0
      ?
      <List dense>
        {assets.map(asset => <Box key={asset.id}><Asset asset={asset} /></Box>)}
      </List>
      :
      <Alert severity="warning" sx={{ mt: 2 }}>No assets yet for this task. Instantiate an interlinker, please.</Alert>
    }

  </>
}


export default Assets;
