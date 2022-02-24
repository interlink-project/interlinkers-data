import {
  Alert, Avatar, IconButton, ListItem, ListItemAvatar, ListItemIcon, ListItemSecondaryAction, ListItemText, Menu,
  MenuItem, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography
} from '@material-ui/core';
import { CopyAll, Delete, Edit, MoreVert as MoreVertIcon, Share } from '@material-ui/icons';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { assetsApi } from '__fakeApi__';

const AssetRow = ({ asset }) => {
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

  useEffect(() => {
    assetsApi.getExternal(asset.id).then((res) => {
      setData(res)
      setLoading(false)
    }
    )

  }, [])

  const MyMenuItem = ({ onClick, text, icon }) => <MenuItem onClick={onClick}>
    <ListItemIcon>
      {icon}
    </ListItemIcon>
    <ListItemText>{text}</ListItemText>
  </MenuItem>

  return data ? <TableRow
    hover
    onClick={() => window.open(asset.link + "/view", "_blank")}
    key={asset.id}
    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
  >
    <TableCell component="th" scope="row">
      <Avatar src={data.icon} sx={{height: "30px", width: "30px"}} />
    </TableCell>
    <TableCell align="left">{data.name}</TableCell>
    <TableCell align="left">
    <b>Created at:</b> {moment(data.created_at).fromNow()}
      <br />
      <b>Updated at:</b>{moment(data.updated_at).fromNow()}
    </TableCell>
    <TableCell align="center">
    <Avatar src={data.creator_id} sx={{height: "20px", width: "20px"}} />
    </TableCell>
    <TableCell align="center"><><IconButton aria-label="settings" id="basic-button"
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
        {asset.capabilities.edit && <MyMenuItem onClick={() => { window.open(data.editLink, "_blank"); setAnchorEl(null); }} text="Edit" icon={<Edit fontSize="small" />} />}
        {asset.capabilities.clone && <MyMenuItem onClick={() => { }} text="Clone" icon={<CopyAll fontSize="small" />} />}
        {asset.capabilities.delete && <MyMenuItem onClick={() => { }} text="Delete" icon={<Delete fontSize="small" />} />}
        <MyMenuItem onClick={() => { }} text="Share" icon={<Share fontSize="small" />} />
      </Menu></></TableCell>
  </TableRow> : <Skeleton animation="wave" height={60} />
}

const Assets = ({ assets }) => {

  useEffect(() => {
    console.log("REFRESH PRINC")
  }, [])
  return <>
    {assets.length > 0 ? <Table sx={{ minWidth: 650 }} aria-label="assets table" size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">Dates</TableCell>
            <TableCell align="center">Creator</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assets.map((asset) => (
            <AssetRow asset={asset} />
          ))}
        </TableBody>
      </Table>
      :
      <Alert severity="warning" sx={{ my: 2 }}>No assets yet for this task. Instantiate an interlinker, please.</Alert>
    }
  </>
}


export default Assets;
