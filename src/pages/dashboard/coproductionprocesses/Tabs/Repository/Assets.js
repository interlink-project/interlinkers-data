import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Button,
  Card,
  CardMedia,
  CardHeader,
  Typography,
  Avatar,
  Alert,
  alpha,
  IconButton,
  InputBase,
  CardActionArea,

} from '@material-ui/core';
import { styled } from '@material-ui/styles';
import { MoreVert as MoreVertIcon, Search as SearchIcon } from '@material-ui/icons';
import { red } from '@material-ui/core/colors';
import moment from 'moment';
import { cleanUnderScores } from "../../../../../utils/cleanUnderscores"
import NewAssetModal from "./NewAssetModal"

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


const Assets = ({ selectedTask }) => {

  const { assets = [] } = selectedTask
  
  const Asset = ({ asset }) => {
    const [error, setError] = useState(false)

    return <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar aria-label="icon" src={asset.file_metadata.icon_link} sx={{ width: 20, height: 20 }} />
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title="Asset title"
        subheader={moment(asset.created_at).fromNow()}
      />
      <CardActionArea rel="noopener noreferrer" target="_blank" href={asset.file_metadata.work_link}>
        <CardMedia>
          <img style={{ width: "100%" }} src={!error ? asset.file_metadata.thumbnail_link : "https://user-images.githubusercontent.com/24848110/33519396-7e56363c-d79d-11e7-969b-09782f5ccbab.png"} alt="asset thumbnail" onError={() => setError(true)} />
        </CardMedia>
      </CardActionArea>

    </Card>
  }
  return <>
    <Box sx={{ justifyContent: "center" }} >
      <Typography variant="h6" sx={{ mb: 2 }}>Assets for {cleanUnderScores(selectedTask.name)} </Typography>
    </Box>
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

    {assets.length === 0 ?
      <Alert severity="warning" sx={{ mt: 2 }}>No assets yet for this task. Instantiate an interlinker, please.</Alert>
      : <Grid container spacing={1} sx={{ mt: 1 }}>{
        assets.map(asset =>
          <Grid item key={asset.id} xl={3} lg={4} md={6} sm={6}>
            <Asset asset={asset} />
          </Grid>)}
      </Grid>}
    <NewAssetModal />
    </>
}


export default Assets;
