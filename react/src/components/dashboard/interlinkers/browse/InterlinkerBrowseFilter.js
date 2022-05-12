import { Box, Card, Chip, Divider, Input, Rating, Typography } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from "translations/i18n";
import MultiSelect from '../../../MultiSelect';

const allNatures = ["softwareinterlinker", "knowledgeinterlinker", "externalsoftwareinterlinker", "externalknowledgeinterlinker"]
const allCreators = ["official", "community"]
const natureMultiselect = {
  label: i18n.t('Nature'),
  options: [
    {
      label: i18n.t('Internal software'),
      value: "softwareinterlinker"
    },
    {
      label: i18n.t('External software'),
      value: "externalsoftwareinterlinker"
    },
    {
      label: i18n.t('Internal knowledge'),
      value: "knowledgeinterlinker"
    },
    {
      label: i18n.t('External knowledge'),
      value: "externalknowledgeinterlinker"
    }
  ]
};


const InterlinkerBrowseFilter = ({ onFiltersChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedNatures, setSelectedNatures] = useState([]);
  const [selectedCreators, setSelectedCreators] = useState([]);
  const [minimumRating, setMinimumRating] = useState(null);
  const didMount = useRef(false);
  const { t } = useTranslation()

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

  return (<>
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
        <MultiSelect
          label={natureMultiselect.label}
          onChange={(e) => setSelectedNatures(e)}
          options={natureMultiselect.options}
          value={selectedNatures}
        />
        <Divider orientation='vertical' flexItem sx={{ mx: 2 }} />

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
    <Box sx={{ mt: 2 }}>
      {inputValue && <Chip sx={{ mr: 1 }} label={`${t("Search")}: ${inputValue}`} onDelete={() => setInputValue("")} />}
      {selectedNatures.map(nature => <Chip sx={{ mr: 1 }} label={`${t("Nature")}: ${natureMultiselect.options.find(option => option.value === nature).label}`} onDelete={() => setSelectedNatures(selectedNatures.filter(nt => nt !== nature))} />)}
      {minimumRating && <Chip sx={{ mr: 1 }} label={`${t("Minimum rating")}: ${minimumRating}`} onDelete={() => setMinimumRating(null)} />}
    </Box>

  </>
  );
};

export default InterlinkerBrowseFilter;
