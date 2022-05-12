import {
  Alert, Avatar, CircularProgress, IconButton, ListItemIcon, ListItemText, Menu,
  MenuItem, Skeleton, Table, TableBody, TableCell, TableHead, TableRow
} from '@material-ui/core';
import { CopyAll, Delete, Download, Edit, MoreVert as MoreVertIcon, Share } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import ConfirmationButton from 'components/ConfirmationButton';
import { InterlinkerDialog } from 'components/dashboard/interlinkers';
import useDependantTranslation from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { assetsApi } from '__api__';
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
  const mounted = useMounted();
  const t = useDependantTranslation()
  const showInterlinkerId = data && (data.externalinterlinker_id || data.knowledgeinterlinker_id || data.softwareinterlinker_id)
  const isInternal = asset.type === "internalasset"

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
    if (isInternal) {
      assetsApi.getInternal(asset.id).then((res) => {
        if (mounted.current) {
          setData({ ...asset, ...res })
          setLoading("")
        }
      })
    } else {
      setData({ ...asset })
      setLoading("")
    }

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

  const getActions = (data) => {
    const actios = []
    if (!data) {
      return actios
    }
    if (data.type === "internalasset" && data.capabilities) {
      const { id, capabilities } = data
      if (capabilities.edit) {
        actios.push(<MyMenuItem key={`${id}-edit-action`} loading={loading} id="edit" onClick={handleEdit} text="Edit" icon={<Edit fontSize="small" />} />)
      }
      if (capabilities.clone) {
        actios.push(<MyMenuItem key={`${id}-clone-action`} loading={loading} id="clone" onClick={handleClone} text="Clone" icon={<CopyAll fontSize="small" />} />)
      }
      if (capabilities.delete) {
        actios.push(<ConfirmationButton
          key={`${id}-delete-action`}
          Actionator={({ onClick }) => <MyMenuItem loading={loading} id="delete" onClick={onClick} text="Delete" icon={<Delete fontSize="small" />} />}
          ButtonComponent={({ onClick }) => <LoadingButton sx={{ mt: 1 }} fullWidth variant='contained' color="error" onClick={onClick}>Confirm deletion</LoadingButton>}
          onClick={handleDelete}
          text="Are you sure?" />)
      }
      if (capabilities.clone) {
        actios.push(<MyMenuItem key={`${id}-share-action`} loading={loading} id="publish" onClick={() => { }} text="Publish" icon={<Share fontSize="small" />} />)
      }
      if (capabilities.download) {
        actios.push(<MyMenuItem key={`${id}-download-action`} loading={loading} id="download" onClick={handleDownload} text="Download" icon={<Download fontSize="small" />} />)
      }
    }
    if (data.type === "externalasset") {
      const { id } = data
      // actios.push(<MyMenuItem key={`${id}-edit-action`} loading={loading} id="edit" onClick={handleEdit} text="Edit" icon={<Edit fontSize="small" />} />)
      actios.push(<MyMenuItem key={`${id}-clone-action`} loading={loading} id="clone" onClick={handleClone} text="Clone" icon={<CopyAll fontSize="small" />} />)
      actios.push(<ConfirmationButton
        key={`${id}-delete-action`}
        Actionator={({ onClick }) => <MyMenuItem loading={loading} id="delete" onClick={onClick} text="Delete" icon={<Delete fontSize="small" />} />}
        ButtonComponent={({ onClick }) => <LoadingButton sx={{ mt: 1 }} fullWidth variant='contained' color="error" onClick={onClick}>Confirm deletion</LoadingButton>}
        onClick={handleDelete}
        text="Are you sure?" />)

    }

    return actios
  }
  const avatarSize = { height: "30px", width: "30px" }
  return <TableRow
    hover
    key={asset.id}
    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
  >
    {data && loading !== "info" ? <>
      <TableCell component="th" scope="row" onClick={() => window.open(data.link + "/view", "_blank")}>
        <Avatar src={data.icon} sx={avatarSize} />
      </TableCell>
      <TableCell style={{ cursor: "pointer" }} onClick={() => {
        if (isInternal) {
          window.open(data.link + "/view", "_blank")
        } else {
          window.open(data.uri)
        }
      }} align="left">{data.name}</TableCell>
      <TableCell align="left">
        {moment(data.created_at).format("LL")}
      </TableCell>
      <TableCell align="left">
        {moment(data.updated_at || data.created_at).fromNow()}
      </TableCell>
      <TableCell align="center">
        {showInterlinkerId ? <InterlinkerReference onClick={() => {
          openInterlinkerDialog(showInterlinkerId)
        }}
          interlinker_id={showInterlinkerId}
        /> : t("external-resource")}
      </TableCell>
      <TableCell align="center">
        {actions ? actions(data) : <IconButton aria-label="settings" id="basic-button"
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
          {getActions(data)}
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
  const t = useDependantTranslation()

  return <>
    {assets.length > 0 ?
      <>
        <InterlinkerDialog open={interlinkerDialogOpen} setOpen={setInterlinkerDialogOpen} interlinker={selectedInterlinker} />
        <Table sx={{ minWidth: 650 }} aria-label="resources table" size="small">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="center">{t("Name")}</TableCell>
              <TableCell align="center">{t("Created")}</TableCell>
              <TableCell align="center">{t("Updated")}</TableCell>
              <TableCell align="center">{t("Interlinker")}</TableCell>
              <TableCell align="center">{t("Actions")}</TableCell>
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
      <Alert severity="info" sx={{ my: 2 }}>{t("No resources yet")}</Alert>
    }
  </>
}

export default Assets;
