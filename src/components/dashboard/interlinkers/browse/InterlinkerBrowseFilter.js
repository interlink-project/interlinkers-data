import React, { useState, useEffect } from 'react';
import { Box, Card, Rating, MenuItem, Divider, InputLabel, Input, Select, Typography, FormControl } from '@material-ui/core';
import SearchIcon from '../../../../icons/Search';
import MultiSelect from '../../../MultiSelect';
import { useDispatch, useSelector } from 'react-redux';

const multiselectOptions = [
  {
    label: 'Nature',
    options: [
      {
        label: 'Software',
        value: "softwareinterlinker"
      },
      {
        label: 'Knowledge',
        value: "knowledgeinterlinker"
      }
    ]
  },
  {
    label: 'Creator',
    options: [
      {
        label: 'Official',
        value: "official"
      },
      {
        label: 'Community',
        value: "community"
      },
    ]
  },
];


const selectOptions = {
  label: 'Order by',
  options: [
    {
      label: 'Popularity',
      value: "popularity"
    },
    {
      label: 'Best rated',
      value: "best_rated"
    },
    {
      label: 'Most recent',
      value: "most_recent"
    },
  ]
};

const allNatures = ["softwareinterlinker", "knowledgeinterlinker"]
const allCreators = ["official", "community"]

const InterlinkerBrowseFilter = ({ onFiltersChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedNatures, setSelectedNatures] = useState(allNatures);
  const [selectedCreators, setSelectedCreators] = useState(allCreators);
  const dispatch = useDispatch();

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleMultiSelectChange = (value, type) => {
    if (type === "Nature") {
      setSelectedNatures(value)
      onFiltersChange(inputValue, value, selectedCreators)
    }
    if (type === "Creator") {
      setSelectedCreators(value)
      onFiltersChange(inputValue, selectedNatures, value)
    }

  };

  useEffect(() => {
    var delayDebounceFn
    delayDebounceFn = setTimeout(() => {
      onFiltersChange(inputValue || null, selectedNatures !== allNatures ? selectedNatures : null, selectedCreators !== allCreators ? selectedCreators : null)
    }, 800)
    return () => {
      if (delayDebounceFn) {
        clearTimeout(delayDebounceFn)
      }
    }
  }, [inputValue])

  const getValues = (type) => {
    {
      if (type === "Nature") {
        return selectedNatures
      } else if (type === "Creator") {
        return selectedCreators
      }
      return []
    }
  }

  return (
    <Card>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          p: 2
        }}
      >
        <SearchIcon fontSize='small' />
        <Box
          sx={{
            flexGrow: 1,
            ml: 3
          }}
        >
          <Input
            disableUnderline
            fullWidth
            onChange={handleInputChange}
            placeholder='Search by text'
            value={inputValue}
          />
        </Box>
      </Box>

      <Divider />
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          p: 1
        }}
      >
        {multiselectOptions.map((multiselect) => (
          <React.Fragment key={multiselect.label}>
            <MultiSelect
              label={multiselect.label}
              onChange={(e) => handleMultiSelectChange(e, multiselect.label)}
              options={multiselect.options}
              value={getValues(multiselect.label)}
            />
            <Divider orientation='vertical' flexItem sx={{ mx: 2 }} />
          </React.Fragment>
        ))}

        <Typography variant="body2" sx={{ mx: 1 }}><b>Minimum rating:</b></Typography>
        <Rating value={1} />
        <Divider orientation='vertical' flexItem sx={{ mx: 2 }} />
        <Typography variant="body2" sx={{ mr: 1 }}><b>Order by:</b></Typography>
        <Select
          labelId={selectOptions.label}
          label={selectOptions.label}
          onChange={console.log}
          value={<Rating value={5} />}
          sx={{ width: "100px", height: "40px" }}
        >
          {selectOptions.options.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
        </Select>
      </Box>
    </Card>
  );
};

export default InterlinkerBrowseFilter;
