import { Box, Card, Chip, Divider, Input, Rating, Typography } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import React, { useEffect, useState } from 'react';
import { problemprofilesApi } from '__api__';
import MultiSelect from '../../../MultiSelect';

const InterlinkerBrowseFilter = ({ filters, onFiltersChange, language }) => {
  const [inputValue, setInputValue] = useState(filters.search);
  const mounted = useMounted()
  const t = useCustomTranslation(language)
  const [problemProfiles, setProblemProfiles] = useState([]);

  useEffect(() => {
    problemprofilesApi.getMulti({}, language).then(res => {
      if (mounted.current) {
        setProblemProfiles(res)
      }
    })
  }, [language])

  const problemprofilesMultiselect = {
    label: t('Problem profiles'),
    options: problemProfiles.map(pp => ({
      label: pp.id + " - " + pp.name,
      value: pp.id
    }))
  };

  const natureMultiselect = {
    label: t('Nature'),
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
  };

  const changeFilter = (key, value) => {
    console.log("CHANGED", key, value)
    const newFilters = { ...filters }
    newFilters[key] = value
    onFiltersChange(newFilters)
  }

  useEffect(() => {
    var delayDebounceFn
    if (mounted.current && inputValue !== filters.search) {
      delayDebounceFn = setTimeout(() => {
        changeFilter("search", inputValue)
      }, 800)
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
            onChange={(event) => {
              setInputValue(event.target.value);
            }}
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
          onChange={(e) => changeFilter("nature", e)}
          options={natureMultiselect.options}
          value={filters.nature}
        />
        <Divider orientation='vertical' flexItem sx={{ mx: 2 }} />
        <MultiSelect
          label={problemprofilesMultiselect.label}
          onChange={(e) => changeFilter("problemprofiles", e)}
          options={problemprofilesMultiselect.options}
          value={filters.problemprofiles}
        />
        <Divider orientation='vertical' flexItem sx={{ mx: 2 }} />

        <Typography variant="body2" sx={{ mx: 1 }}><b>{t("Minimum rating")}:</b></Typography>
        <Rating value={filters.rating} onChange={(e, value) => changeFilter("rating", value)} />
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
    <Box sx={{ mt: 1 }}>
      {filters.search && <Chip sx={{ mr: 1, mt: 1 }} label={`${t("Search")}: ${filters.search}`} onDelete={() => changeFilter("search", "")} />}
      {filters.nature.map(nature => <Chip key={`active-filter-${nature}`} sx={{ mr: 1, mt: 1 }} label={`${t("Nature")}: ${natureMultiselect.options.find(option => option.value === nature).label}`} onDelete={() => changeFilter("nature", filters.nature.filter(nt => nt !== nature))} />)}
      {problemProfiles.length > 0 && filters.problemprofiles.map(pp => <Chip key={`active-filter-${pp}`} sx={{ mr: 1, mt: 1 }} label={`${t("Problem profile")}: ${problemProfiles.find(el => el.id === pp).id}`} onDelete={() => changeFilter("problemprofiles", filters.problemprofiles.filter(problemprofile => problemprofile !== pp))} />)}
      {filters.rating && <Chip sx={{ mr: 1, mt: 1 }} label={`${t("Minimum rating")}: ${filters.rating}`} onDelete={() => changeFilter("rating", null)} />}
    </Box>

  </>
  );
};

export default InterlinkerBrowseFilter;
