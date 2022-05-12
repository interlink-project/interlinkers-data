import { Box, Card, Divider, Input, Rating, Typography } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import MultiSelect from '../../../MultiSelect';


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

const InterlinkerBrowseFilter = ({ onFiltersChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedNatures, setSelectedNatures] = useState([]);
  const [selectedCreators, setSelectedCreators] = useState([]);
  const [minimumRating, setMinimumRating] = useState(0);
  const didMount = useRef(false);
  const {t} = useTranslation()

  const multiselectOptions = [
    {
      label: t('Nature'),
      id: "nature",
      options: [
        {
          label: t('Internal software'),
          value: "softwareinterlinker"
        },
        {
          label: t('External software'),
          value: "externalsoftwareinterlinker"
        },
        {
          label: t('Internal knowledge'),
          value: "knowledgeinterlinker"
        },
        {
          label: t('External knowledge'),
          value: "externalknowledgeinterlinker"
        }
      ]
    },
    /* {
      label: t('Problem profiles'),
      id: "problemprofiles",
      options: problemprofiles.map(pp => ({
        label: pp.name,
        value: pp.id
      }))
    },
    {
      label: t('Maintainer'),
      id: "maintainer",
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
    },*/
  ];


const allNatures = ["softwareinterlinker", "knowledgeinterlinker", "externalsoftwareinterlinker", "externalknowledgeinterlinker"]
const allCreators = ["official", "community"]

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const update = () => onFiltersChange({
    search: inputValue || null,
    nature: selectedNatures !== allNatures ? selectedNatures : null,
    creator: selectedCreators !== allCreators ? selectedCreators : null,
    rating: minimumRating || null
  })

  useEffect(() => {
    update()
  }, [selectedNatures, selectedCreators, minimumRating])

  const handleMultiSelectChange = (value, id) => {
    if (id === "nature") {
      setSelectedNatures(value)
    }
    if (id === "maintainer") {
      setSelectedCreators(value)
    }

  };

  useEffect(() => {
    var delayDebounceFn
    if (didMount.current) {
      delayDebounceFn = setTimeout(() => {
        update()
      }, 800)
    }
    else {
      didMount.current = true
    }
    return () => {
      if (delayDebounceFn) {
        clearTimeout(delayDebounceFn)
      }
    }
  }, [inputValue])

  const getValues = (id) => {
    {
      if (id === "nature") {
        return selectedNatures
      } else if (id === "maintainer") {
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
        <Search fontSize='small' />
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
            placeholder={t('Search')}
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
              onChange={(e) => handleMultiSelectChange(e, multiselect.id)}
              options={multiselect.options}
              value={getValues(multiselect.id)}
            />
            <Divider orientation='vertical' flexItem sx={{ mx: 2 }} />
          </React.Fragment>
        ))}

        <Typography variant="body2" sx={{ mx: 1 }}><b>{t("Minimum rating")}:</b></Typography>
        <Rating value={minimumRating} onChange={(e, value) => setMinimumRating(value)} />
        <Divider orientation='vertical' flexItem sx={{ mx: 2 }} />
        {/*<Typography variant="body2" sx={{ mr: 1 }}><b>Order by:</b></Typography>
        <Select
          labelId={selectOptions.label}
          label={selectOptions.label}
          onChange={console.log}
          value={<Rating value={5} />}
          sx={{ width: "100px", height: "40px" }}
        >
          {selectOptions.options.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
        </Select>*/}
      </Box>
    </Card>
  );
};

export default InterlinkerBrowseFilter;
