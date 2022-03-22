import {
  Alert, Avatar, Box, Button, CircularProgress, IconButton, ListItemIcon, ListItemText, Menu,
  MenuItem, Popover, Skeleton, Table, TableBody, TableCell, TableHead, TableRow, Typography
} from '@material-ui/core';
import { CopyAll, Delete, Download, Edit, MoreVert as MoreVertIcon, Share } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import ConfirmationButton from 'components/ConfirmationButton';
import moment from 'moment';
import InterlinkerDialog from 'pages/dashboard/interlinkers/InterlinkerDialog';
import React, { useEffect, useState } from 'react';
import { assetsApi } from '__fakeApi__';
import { InterlinkerReference } from '../interlinkers';

const MyMenuItem = ({ onClick, text, icon, id, loading }) => {
  return <MenuItem aria-describedby={id} onClick={onClick}>
    <ListItemIcon>
      {loading === id ? <CircularProgress /> : icon}
    </ListItemIcon>
    <ListItemText>{text}</ListItemText>
  </MenuItem>
}

const AssetRow = ({ asset, onChange, actions, openInterlinkerDialog }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState("data")
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
      setLoading("")
    }
    )

  }, [])

  const handleDelete = () => {
    setLoading("delete");
    assetsApi.delete(asset.id).then(() => {
      setLoading("");
      onChange && onChange();
      setAnchorEl(null);
    });
  }

  const handleClone = () => {
    setLoading("clone");
    assetsApi.clone(asset.id).then(() => {
      setLoading("");
      onChange && onChange();
      setAnchorEl(null);
    })
  }

  const handleDownload = () => {
    window.open(asset.link + "/download", "_blank");
    setAnchorEl(null);
  }

  const handleEdit = () => {
    window.open(asset.link + "/edit", "_blank");
    setAnchorEl(null);
  }

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
      <InterlinkerReference onClick={() => {
        openInterlinkerDialog(asset.knowledgeinterlinker_id || asset.softwareinterlinker_id)
      }}
        interlinker_id={asset.knowledgeinterlinker_id || asset.softwareinterlinker_id}
      />
    </TableCell>
    <TableCell align="center">
      {actions || <IconButton aria-label="settings" id="basic-button"
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
        {asset.capabilities.edit && <MyMenuItem loading={loading} id="edit" onClick={handleEdit} text="Edit" icon={<Edit fontSize="small" />} />}
        {asset.capabilities.clone && <MyMenuItem loading={loading} id="clone" onClick={handleClone} text="Clone" icon={<CopyAll fontSize="small" />} />}
        {asset.capabilities.delete && <ConfirmationButton
          Actionator={({ onClick }) => <MyMenuItem loading={loading} id="delete" onClick={onClick} text="Delete" icon={<Delete fontSize="small" />} />}
          ButtonComponent={({ onClick }) => <LoadingButton sx={{ mt: 1 }} fullWidth variant='contained' color="error" onClick={onClick}>Confirm deletion</LoadingButton>}
          onClick={handleDelete}
          text="Are you sure?" />}
        {asset.capabilities.clone && <MyMenuItem loading={loading} id="publish" onClick={() => { }} text="Publish" icon={<Share fontSize="small" />} />}
        {asset.capabilities.download && <MyMenuItem loading={loading} id="download" onClick={handleDownload} text="Download" icon={<Download fontSize="small" />} />}
        {loading && <CircularProgress size={10} />}
      </Menu>
    </TableCell>
  </TableRow>
    :
    <Skeleton animation="wave" height={60} />
}

const Assets = ({ assets, onChange = () => { }, actions }) => {
  const [interlinkerDialogOpen, setInterlinkerDialogOpen] = useState(false);
  const [selectedInterlinker, setSelectedInterlinker] = useState(false);

  return <>
    {assets.length > 0 ?
      <>
        <InterlinkerDialog open={interlinkerDialogOpen} setOpen={setInterlinkerDialogOpen} interlinker={selectedInterlinker} />
        <Table sx={{ minWidth: 650 }} aria-label="resources table" size="small">
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
              <AssetRow openInterlinkerDialog={(id) => { setInterlinkerDialogOpen(true); setSelectedInterlinker(id) }} asset={asset} onChange={onChange} actions={actions} />
            ))}
          </TableBody>
        </Table>
      </>
      :
      <Alert severity="info" sx={{ my: 2 }}>No resources yet</Alert>
    }
  </>
}


export default Assets;
