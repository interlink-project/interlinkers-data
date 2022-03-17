import {
  Alert, Avatar, CircularProgress, IconButton, ListItemIcon, ListItemText, Menu,
  MenuItem, Skeleton, Table, TableBody, TableCell, TableHead, TableRow
} from '@material-ui/core';
import { CopyAll, Delete, Download, Edit, MoreVert as MoreVertIcon, Share } from '@material-ui/icons';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { assetsApi } from '__fakeApi__';
import { InterlinkerReference } from '../interlinkers';

const AssetRow = ({ asset, onChange, actions }) => {
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
    key={asset.id}
    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
  >
    <TableCell component="th" scope="row" onClick={() => window.open(asset.link + "/view", "_blank")}>
      <Avatar src={data.icon} sx={{ height: "30px", width: "30px" }} />
    </TableCell>
    <TableCell style={{ cursor: "pointer" }} onClick={() => window.open(asset.link + "/view", "_blank")} align="left">{data.name}</TableCell>
    <TableCell align="left">
      {moment(data.created_at).format("LL")}
    </TableCell>
    <TableCell align="left">
      {moment(data.updated_at || data.created_at).fromNow()}
    </TableCell>
    <TableCell align="center">
      <InterlinkerReference interlinker_id={asset.knowledgeinterlinker_id || asset.interlinker_id} />
    </TableCell>
    <TableCell align="center">
      {actions ||  <IconButton aria-label="settings" id="basic-button"
      aria-controls="basic-menu"
      aria-haspopup="true"
      aria-expanded={open ? 'true' : undefined}
      onClick={handleClick}
    >
      <MoreVertIcon />
    </IconButton>}
     
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {asset.capabilities.edit && <MyMenuItem onClick={() => { window.open(asset.link + "/edit", "_blank"); setAnchorEl(null); }} text="Edit" icon={<Edit fontSize="small" />} />}
        {asset.capabilities.clone && <MyMenuItem onClick={() => { assetsApi.clone(asset.id).then(() => {onChange && onChange();  setAnchorEl(null); }) }} text="Clone" icon={<CopyAll fontSize="small" />} />}
        {asset.capabilities.delete && <MyMenuItem onClick={() => { assetsApi.delete(asset.id).then(() =>{ onChange && onChange();  setAnchorEl(null); }); }} text="Delete" icon={<Delete fontSize="small" />} />}
        {asset.capabilities.clone && <MyMenuItem onClick={() => { }} text="Publish" icon={<Share fontSize="small" />} />}
        {asset.capabilities.download && <MyMenuItem onClick={() => { window.open(asset.link + "/download", "_blank"); setAnchorEl(null); }}  text="Download" icon={<Download fontSize="small" />} />}
        {/* <MyMenuItem text="Share" onClick={() => { }} icon={<Share fontSize="small" />} /> */}
        {loading && <CircularProgress />}
      </Menu>
      </TableCell>
  </TableRow>
  : 
  <Skeleton animation="wave" height={60} />
}

const Assets = ({ assets, onChange = () => {}, actions }) => {
  return <>
    {assets.length > 0 ? <Table sx={{ minWidth: 650 }} aria-label="resources table" size="small">
      <TableHead>
        <TableRow>
          <TableCell></TableCell>
          <TableCell align="center">Name</TableCell>
          <TableCell align="center">Created</TableCell>
          <TableCell align="center">Updated</TableCell>
          <TableCell align="center">Interlinker</TableCell>
          <TableCell align="center">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {assets.map((asset) => (
          <AssetRow asset={asset} onChange={onChange} actions={actions} />
        ))}
      </TableBody>
    </Table>
      :
      <Alert severity="info" sx={{ my: 2 }}>No resources yet</Alert>
    }
  </>
}


export default Assets;
