import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Grid,
  ListItemText,
  Menu,
  MenuItem,
  Pagination,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@material-ui/core';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import InterlinkerCard from './InterlinkerCard';
import { useSelector } from 'react-redux';

const InterlinkerBrowseResults = (props) => {
  const { interlinkers } = useSelector((state) => state.catalogue);
  const sortRef = useRef(null);
  const [openSort, setOpenSort] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Most popular');
  const [mode, setMode] = useState('grid');
  
  const handleSortOpen = () => {
    setOpenSort(true);
  };

  const handleSortClose = () => {
    setOpenSort(false);
  };

  const handleSortSelect = (value) => {
    setSelectedSort(value);
    setOpenSort(false);
  };

  const handleModeChange = (event, value) => {
    setMode(value);
  };

  return (
    <div {...props}>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          mb: 2
        }}
      >
        <Typography
          color='textPrimary'
          sx={{
            position: 'relative',
            '&:after': {
              backgroundColor: 'primary.main',
              bottom: '-8px',
              content: '" "',
              height: '3px',
              left: 0,
              position: 'absolute',
              width: '48px'
            }
          }}
          variant='h5'
        >
          Showing
          {' '}
          {interlinkers.length}
          {' '}
          interlinkers
        </Typography>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex'
          }}
        >
          <Button
            color='primary'
            onClick={handleSortOpen}
            ref={sortRef}
            sx={{
              textTransform: 'none',
              letterSpacing: 0,
              mr: 2
            }}
            variant='text'
          >
            {selectedSort}
            <ArrowDropDownIcon fontSize='small' />
          </Button>
          <ToggleButtonGroup
            exclusive
            onChange={handleModeChange}
            size='small'
            value={mode}
          >
            <ToggleButton value='grid'>
              <ViewModuleIcon fontSize='small' />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>
      <Grid
        container
        spacing={3}
      >
        {interlinkers.map((interlinker) => (
          <Grid
            item
            key={interlinker.id}
            md={mode === 'grid' ? 4 : 12}
            sm={mode === 'grid' ? 6 : 12}
            xs={12}
          >
            <InterlinkerCard interlinker={interlinker} />
          </Grid>
        ))}
      </Grid>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 6
        }}
      >
        <Pagination count={3} />
      </Box>
      <Menu
        anchorEl={sortRef.current}
        elevation={1}
        onClose={handleSortClose}
        open={openSort}
      >
        {[
          'Most recent',
          'Popular',
          'Price high',
          'Price low',
          'On sale'
        ].map((option) => (
          <MenuItem
            key={option}
            onClick={() => handleSortSelect(option)}
          >
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default InterlinkerBrowseResults;
