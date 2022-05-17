import { Box, Grid, ToggleButton, ToggleButtonGroup, Typography } from '@material-ui/core';
import { ViewModule } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import { InterlinkerBrowseFilter, InterlinkerCard } from 'components/dashboard/interlinkers';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import { useEffect, useState } from 'react';
import { getLanguage } from 'translations/i18n';
import { interlinkersApi } from '__api__';

const initialDefaultFilters = {
  search: "",
  problemprofiles: [],
  nature: ["softwareinterlinker", "knowledgeinterlinker", "externalsoftwareinterlinker", "externalknowledgeinterlinker"],
  rating: null,
}

const InterlinkerBrowse = ({ language = getLanguage(), initialFilters = {}, onInterlinkerClick }) => {
  const mounted = useMounted();
  const t = useCustomTranslation(language)

  const [mode, setMode] = useState('grid');

  const handleModeChange = (event, value) => {
    setMode(value);
  };

  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(9);
  const [filters, setFilters] = useState({ ...initialDefaultFilters, ...initialFilters });
  const [loadedRows, setLoadedRows] = useState([]);

  const hasNextPage = loadedRows.length < total

  const loadServerRows = async (page, loadedRows) => {
    setLoading(true);
    try {
      interlinkersApi.getMulti({ page: page + 1, size, ...filters }, language).then(res => {
        if (mounted.current) {
          setLoading(false);
          setPage(page + 1)
          setTotal(res.total)
          setLoadedRows([...loadedRows, ...res.items].filter((element, index, self) => self.indexOf(el => el.id === element.id) !== index))
        }
      })

    } catch (err) {
      console.error("Failed to load data: ", err);
    }
  };

  const handleLoadMore = async () => {
    console.log(hasNextPage, loadedRows.length, "/", total)
    if (hasNextPage) {
      loadServerRows(page, loadedRows)
    }
  };

  useEffect(() => {
    setPage(0)
    setLoadedRows([])
    loadServerRows(0, [])
  }, [filters])

  return (
    <>
      <Box sx={{ mt: 3 }}>
        <InterlinkerBrowseFilter loading={loading} language={language} filters={filters} onFiltersChange={setFilters} />
      </Box>

      <Box sx={{ mt: 6 }}>
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
            variant='h6'
          >
            {t("interlinkers-catalogue-total", { total })}
          </Typography>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex'
            }}
          >
            <ToggleButtonGroup
              exclusive
              onChange={handleModeChange}
              size='small'
              value={mode}
            >
              <ToggleButton value='grid'>
                <ViewModule fontSize='small' />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        <Grid
          container
          spacing={3}
        >
          {loadedRows.map((interlinker, i) => (
            <Grid
              item
              key={interlinker.id}
              md={mode === 'grid' ? 4 : 12}
              sm={mode === 'grid' ? 6 : 12}
              xs={12}
            >
              <InterlinkerCard language={language} interlinker={interlinker} onInterlinkerClick={onInterlinkerClick} mode={mode} />
            </Grid>
          ))}

          <Grid item xs={12} sx={{ justifyContent: "center", textAlign: "center" }}>
            {hasNextPage && <LoadingButton loading={loading} variant="contained" onClick={handleLoadMore}>{t("Load more")}</LoadingButton>}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default InterlinkerBrowse;
