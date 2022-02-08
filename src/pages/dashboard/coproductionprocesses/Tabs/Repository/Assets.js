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
import { MoreVert as MoreVertIcon, Search as SearchIcon, OpenInNew, Edit, CopyAll, Delete } from '@material-ui/icons';
import moment from 'moment';
import axiosInstance from 'axiosInstance';

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

    return data ? <ListItem button onClick={() => window.open(data.viewLink, "_blank")} >
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
    </ListItem>: <Skeleton animation="wave" height={60} />
  }
  return <>

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
