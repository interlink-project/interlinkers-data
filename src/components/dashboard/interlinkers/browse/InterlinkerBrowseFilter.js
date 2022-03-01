import React, { useState, useEffect } from 'react';
import { Box, Card, Checkbox, MenuItem, Divider, FormControlLabel, Input, Select, Switch, FormControl } from '@material-ui/core';
import SearchIcon from '../../../../icons/Search';
import MultiSelect from '../../../MultiSelect';
import { getInterlinkers } from 'slices/catalogue';
import { useDispatch, useSelector } from 'react-redux';

const multiselectOptions = [
  {
    label: 'Nature',
    options: [
      'Software',
      'Knowledge',
      'Best practice'
    ]
  },
  {
    label: 'Creator',
    options: [
      'Official',
      'Team',
      'Particular',
    ]
  },
];


const selectOptions = [
  {
    label: 'Creation date',
    options: [
      'Last week',
      'Last month',
      'Last year',
    ]
  },
];

const InterlinkerBrowseFilter = (props) => {
  const [inputValue, setInputValue] = useState('');
  const dispatch = useDispatch();

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleMultiSelectChange = (value) => {
    console.log(value);
  };

  useEffect(() => {
    var delayDebounceFn
    if(inputValue){
      delayDebounceFn = setTimeout(() => {
        dispatch(getInterlinkers(inputValue))
      }, 800)
    }
    

    return () => {
      if(delayDebounceFn){
        clearTimeout(delayDebounceFn)
      }
    }
  }, [inputValue])

  return (
    <Card {...props}>
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
        {multiselectOptions.map((option) => (
          <React.Fragment key={option.label}>
            <MultiSelect
              label={option.label}
              onChange={handleMultiSelectChange}
              options={option.options}
              value={[]}
            />
            <Divider orientation='vertical' style={{  width: "20px" }} />
          </React.Fragment>
        ))}
        {selectOptions.map((option) => (
          <FormControl variant="standard" key={option.label}>
            <Select
              label={option.label}
              placeholder={option.label}
              onChange={handleMultiSelectChange}
              value={null}
            >
            { option.options.map((opt) => <MenuItem value={opt}>{opt}</MenuItem>) }
            </Select>
            <Divider orientation='vertical' style={{  width: "20px" }} />
          </FormControl>
        ))}
      </Box>
    </Card>
  );
};

export default InterlinkerBrowseFilter;
