import Chart from 'react-apexcharts';
import {
  Box,
  Button,
  Card,
  Divider,
  Typography,
  LinearProgress,
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import ArrowRightIcon from '../../../icons/ArrowRight';
import PropTypes from 'prop-types';

const BarChart = () => {
  const theme = useTheme();

  const chartOptions = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: ['#7783DB'],
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: false,
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
    },
    stroke: {
      width: 0,
    },
    theme: {
      mode: theme.palette.mode,
    },
    tooltip: {
      enabled: false,
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
  };

  const chartSeries = [{ data: [10, 20, 30, 40, 50, 60, 5] }];

  return (
    <Chart
      options={chartOptions}
      series={chartSeries}
      type='bar'
      width={120}
    />
  );
};

const OverviewCard = ({
  title,
  description,
  buttonText,
  buttonAction,
  component,
}) => {
  const theme = useTheme();

  const chartOptions = {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    colors: ['#27c6db'],
    labels: [''],
    plotOptions: {
      radialBar: {
        dataLabels: {
          value: {
            show: false,
          },
        },
        hollow: {
          size: '60%',
        },
        track: {
          background: theme.palette.background.default,
        },
      },
    },
    theme: {
      mode: theme.palette.mode,
    },
  };

  const chartSeries = [83];

  return (
    <Box sx={{ mt: 2 }}>
      <Card>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            p: 3,
          }}
        >
          <div>
            <Typography
              color='textPrimary'
              sx={{ mt: 1 }}
              variant='h5'
            >
              {title}
            </Typography>
            <Typography
              color='textPrimary'
              variant='subtitle2'
            >
              {description}
            </Typography>
          </div>
          {component || <BarChart />}
        </Box>
        <Divider />
        <Box
          sx={{
            px: 3,
            py: 2,
          }}
        >
          <Button
            color='primary'
            endIcon={<ArrowRightIcon fontSize='small' />}
            variant='text'
          >
            {buttonText}
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

OverviewCard.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  buttonText: PropTypes.string,
  buttonAction: PropTypes.func,
  component: PropTypes.object,
};

export default OverviewCard;
