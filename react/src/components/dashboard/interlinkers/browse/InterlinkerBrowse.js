import { useMatomo } from '@datapunt/matomo-tracker-react';
import { Box } from '@material-ui/core';
import { InterlinkerBrowseFilter } from 'components/dashboard/interlinkers';
import { useState } from 'react';
import { getLanguage } from 'translations/i18n';
import InterlinkerResults from './InterlinkerResults';

const initialDefaultFilters = {
  search: "",
  problemprofiles: [],
  nature: ["softwareinterlinker", "knowledgeinterlinker", "externalsoftwareinterlinker", "externalknowledgeinterlinker"],
  rating: null,
}

const InterlinkerBrowse = ({ language = getLanguage(), initialFilters = {}, onInterlinkerClick }) => {
  // const mounted = useMounted();
  // const t = useCustomTranslation(language)

  const [filters, _setFilters] = useState({ ...initialDefaultFilters, ...initialFilters });
  const [loading, setLoading] = useState(true);
  const { trackEvent } = useMatomo()

  const setFilters = (filters) => {
    trackEvent({
      category: 'catalogue',
      action: 'filter-interlinkers',
      name: JSON.stringify(filters)
    })
    _setFilters(filters)
  }
  return (
    <>
      <Box sx={{ mt: 3 }}>
        <InterlinkerBrowseFilter loading={loading} language={language} filters={filters} onFiltersChange={setFilters} />
      </Box>

      <Box sx={{ mt: 6 }}>
        <InterlinkerResults loading={loading} setLoading={setLoading} language={language} filters={filters} onInterlinkerClick={onInterlinkerClick} />
      </Box>
    </>
  );
};

export default InterlinkerBrowse;
