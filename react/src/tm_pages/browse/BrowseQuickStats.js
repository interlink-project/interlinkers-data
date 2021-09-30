import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Container } from '@material-ui/core';
import QuickStats1 from '../../tm_components/widgets/quick-stats/QuickStats1';
import QuickStats2 from '../../tm_components/widgets/quick-stats/QuickStats2';
import QuickStats3 from '../../tm_components/widgets/quick-stats/QuickStats3';
import QuickStats4 from '../../tm_components/widgets/quick-stats/QuickStats4';
import QuickStats5 from '../../tm_components/widgets/quick-stats/QuickStats5';
import QuickStats6 from '../../tm_components/widgets/quick-stats/QuickStats6';
import QuickStats7 from '../../tm_components/widgets/quick-stats/QuickStats7';
import QuickStats8 from '../../tm_components/widgets/quick-stats/QuickStats8';
import WidgetPreviewer from '../../tm_components/WidgetPreviewer';
import gtm from '../../lib/gtm';

const BrowseQuickStats = () => {
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Browse: Quick Stats</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          minHeight: '100%',
          py: 8
        }}
      >
        <Container maxWidth='lg'>
          <Box>
            <WidgetPreviewer
              element={<QuickStats1 />}
              name='Stat card with donut chart'
            />
            <WidgetPreviewer
              element={<QuickStats2 />}
              name='Stat card with donut chart'
            />
            <WidgetPreviewer
              element={<QuickStats3 />}
              name='Stat card with multiple sections'
            />
            <WidgetPreviewer
              element={<QuickStats4 />}
              name='Stat card with multiple sections and chips'
            />
            <WidgetPreviewer
              element={<QuickStats5 />}
              name='Stat card with area charts'
            />
            <WidgetPreviewer
              element={<QuickStats6 />}
              name='Stat card with circular charts'
            />
            <WidgetPreviewer
              element={<QuickStats7 />}
              name='Progress bar card'
            />
            <WidgetPreviewer
              element={<QuickStats8 />}
              name='Card with line chart'
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default BrowseQuickStats;
