import {
  Alert, Avatar, Box, CircularProgress, Fade, Grow, IconButton, LinearProgress, ListItemIcon, ListItemText, Menu,
  MenuItem, Skeleton, Table, TableBody, TableCell, TableHead, TableRow, Zoom
} from '@material-ui/core';
import { Article, MoreVert as MoreVertIcon, ShowChart } from '@material-ui/icons';
import { InterlinkerDialog } from 'components/dashboard/interlinkers';
import SearchBox from 'components/SearchBox';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
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

const AssetRow = ({ inputValue, language, asset, actions, openInterlinkerDialog }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState("data")
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const mounted = useMounted();
  const t = useCustomTranslation(language)
  const showInterlinkerId = data && (data.externalinterlinker_id || data.knowledgeinterlinker_id || data.softwareinterlinker_id)
  const isInternal = asset.type === "internalasset"

  const show = inputValue ? data ? data.name.toLowerCase().includes(inputValue) : false : true

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
      if (mounted.current) {
        setData({ ...asset })
        setLoading("")
      }
    }

  }, [asset, mounted])

  const handleOpen = () => {
    if (isInternal) {
      window.open(data.link + "/view", "_blank")
    } else {
      window.open(data.uri)
    }
  }

  const avatarSize = { height: "30px", width: "30px" }
  return <Grow in={show}><TableRow
    hover
    key={asset.id}
    sx={{ display: !show && "none", '&:last-child td, &:last-child th': { border: 0 }, '& > *': { borderBottom: 'unset' }, cursor: 'pointer' }} onClick={handleOpen}
  >
    {data && loading !== "info" ? <>
      <TableCell width="5%" component="th" scope="row">
        <Avatar src={data.icon} sx={avatarSize} >{!data.icon && <Article />}</Avatar>
      </TableCell>
      <TableCell width="35%" style={{ cursor: "pointer" }} align="left">{data.name}</TableCell>
      <TableCell width="15%" align="left">
        {moment(data.created_at).format("LL")}
      </TableCell>
      <TableCell width="15%" align="left">
        {moment(data.updated_at || data.created_at).fromNow()}
      </TableCell>
      <TableCell width="20%" align="center">
        {showInterlinkerId ? <InterlinkerReference onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
          openInterlinkerDialog(showInterlinkerId)
        }}
          interlinker_id={showInterlinkerId}
        /> : t("external-resource")}
      </TableCell>
      <TableCell width="10%" align="center">
        {actions && <IconButton aria-label="settings" id="basic-button"
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
          {actions && actions.map(({ id, loading, onClick, text, icon }) => <MyMenuItem key={id} loading={loading} id={id} onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();
            onClick(handleClose)
          }} text={text} icon={icon} />)}
        </Menu>
      </TableCell></> : <>
      <TableCell colSpan={6}><Skeleton animation="wave" sx={{ width: "100%" }} height={60} /></TableCell>
    </>
    }
  </TableRow></Grow>

}

const Assets = ({ language, loading, assets, getActions = null }) => {
  const [interlinkerDialogOpen, setInterlinkerDialogOpen] = useState(false);
  const [selectedInterlinker, setSelectedInterlinker] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const t = useCustomTranslation(language)

  return <>
    <InterlinkerDialog language={language} open={interlinkerDialogOpen} setOpen={setInterlinkerDialogOpen} interlinker={selectedInterlinker} />
    <Box sx={{ my: 2, mx: 10 }}>
      <SearchBox size="small" language={language} loading={loading} inputValue={inputValue} setInputValue={setInputValue} />
    </Box>

    <Table sx={{ minWidth: 300 }} aria-label="resources table" size="small">
      <TableHead>
        <TableRow>
          <TableCell width="5%"></TableCell>
          <TableCell width="35%" align="center">{t("Name")}</TableCell>
          <TableCell width="15%" align="center">{t("Created")}</TableCell>
          <TableCell width="15%" align="center">{t("Updated")}</TableCell>
          <TableCell width="20%" align="center">{t("Interlinker")}</TableCell>
          <TableCell width="10%" align="center">{t("Actions")}</TableCell>
        </TableRow>
        {false && loading && <TableRow>
          <TableCell colSpan={6}> <LinearProgress /></TableCell>
        </TableRow>}
      </TableHead>

      <TableBody>
        {!loading && assets.map((asset) => (
          <React.Fragment key={asset.id}>
            <AssetRow inputValue={inputValue} language={language} openInterlinkerDialog={(id) => { setInterlinkerDialogOpen(true); setSelectedInterlinker(id) }} asset={asset} actions={getActions && getActions(asset)} />
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
    {assets.length === 0 && <Alert severity="info" sx={{ my: 2 }}>{t("No resources yet")}</Alert>}
  </>
}

export default Assets;
