import React, { useState, useEffect } from 'react';
import { Box, Card, Checkbox, Chip, Divider, FormControlLabel, Input, Switch } from '@material-ui/core';
import SearchIcon from '../../../../icons/Search';
import MultiSelect from '../../../MultiSelect';
import { getInterlinkers } from 'slices/catalogue';
import { useDispatch, useSelector } from 'react-redux';

const selectOptions = [
  {
    label: 'Nature',
    options: [
      'Software',
      'Knowledge',
    ]
  },
  {
    label: 'Status',
    options: [
      'On',
      'Off',
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
        {selectOptions.map((option) => (
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

        <FormControlLabel control={<Switch size="small" defaultChecked />} label="Show only liked" />

      </Box>
    </Card>
  );
};

export default InterlinkerBrowseFilter;
