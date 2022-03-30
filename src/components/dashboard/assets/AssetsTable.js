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
import { assetsApi } from '__api__';
import { InterlinkerReference } from '../interlinkers';
import useMounted from 'hooks/useMounted';

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
  const mounted = useMounted();

  const handleClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setLoading("info")
    assetsApi.getExternal(asset.id).then((res) => {
      if (mounted.current) {
        setData({ ...asset, ...res })
        setLoading("")
      }
    })
  }, [asset, mounted])

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
  const avatarSize = { height: "30px", width: "30px" }
  return <TableRow
    hover
    key={asset.id}
    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
  >
    {data && loading !== "info" ? <><TableCell component="th" scope="row" onClick={() => window.open(data.link + "/view", "_blank")}>
      <Avatar src={data.icon} sx={avatarSize} />
    </TableCell>
      <TableCell style={{ cursor: "pointer" }} onClick={() => window.open(data.link + "/view", "_blank")} align="left">{data.name}</TableCell>
      <TableCell align="left">
        {moment(data.created_at).format("LL")}
      </TableCell>
      <TableCell align="left">
        {moment(data.updated_at || data.created_at).fromNow()}
      </TableCell>
      <TableCell align="center">
        <InterlinkerReference onClick={() => {
          openInterlinkerDialog(data.knowledgeinterlinker_id || data.softwareinterlinker_id)
        }}
          interlinker_id={data.knowledgeinterlinker_id || data.softwareinterlinker_id}
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
          {data.capabilities.edit && <MyMenuItem loading={loading} id="edit" onClick={handleEdit} text="Edit" icon={<Edit fontSize="small" />} />}
          {data.capabilities.clone && <MyMenuItem loading={loading} id="clone" onClick={handleClone} text="Clone" icon={<CopyAll fontSize="small" />} />}
          {data.capabilities.delete && <ConfirmationButton
            Actionator={({ onClick }) => <MyMenuItem loading={loading} id="delete" onClick={onClick} text="Delete" icon={<Delete fontSize="small" />} />}
            ButtonComponent={({ onClick }) => <LoadingButton sx={{ mt: 1 }} fullWidth variant='contained' color="error" onClick={onClick}>Confirm deletion</LoadingButton>}
            onClick={handleDelete}
            text="Are you sure?" />}
          {data.capabilities.clone && <MyMenuItem loading={loading} id="publish" onClick={() => { }} text="Publish" icon={<Share fontSize="small" />} />}
          {data.capabilities.download && <MyMenuItem loading={loading} id="download" onClick={handleDownload} text="Download" icon={<Download fontSize="small" />} />}
          {loading && <CircularProgress size={10} />}
        </Menu>
      </TableCell></> : <>
      <TableCell><Skeleton animation="wave" variant="circular" sx={avatarSize} /></TableCell>
      <TableCell><Skeleton animation="wave" sx={{ width: "100%" }} height={60} /></TableCell>
      <TableCell><Skeleton animation="wave" sx={{ width: "100%" }} height={60} /></TableCell>
      <TableCell><Skeleton animation="wave" sx={{ width: "100%" }} height={60} /></TableCell>
      <TableCell><Skeleton animation="wave" sx={{ width: "100%" }} height={60} /></TableCell>
      <TableCell><Skeleton animation="wave" sx={{ width: "100%" }} height={60} /></TableCell>
    </>
    }
  </TableRow>

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
