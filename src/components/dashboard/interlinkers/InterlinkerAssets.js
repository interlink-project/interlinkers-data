import PropTypes from 'prop-types';
import { Box, Card, CardContent } from '@material-ui/core';
import FileDropzone from '../../FileDropzone';
import InterlinkerFileCard from './InterlinkerFileCard';

const InterlinkerOverview = (props) => {
  const { interlinker, ...other } = props;

  return (
    <Box sx={{ mt: 3 }}>
      <Card>
        <CardContent>
          <FileDropzone />
        </CardContent>
      </Card>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          mb: -1,
          mt: 2,
          mx: -1,
        }}
      >
        {[
        {
          id: '5e8dd0721b9e0fab56d7238b',
          mimeType: 'image/png',
          name: 'example-interlinker1.jpg',
          size: 1024 * 1024 * 3,
          url: '/static/mock-images/interlinkers/interlinker_4.png',
        },
        {
          id: '5e8dd0784431995a30eb2586',
          mimeType: 'application/zip',
          name: 'docs.zip',
          size: 1024 * 1024 * 25,
          url: '#',
        },
        {
          id: '5e8dd07cbb62749296ecee1c',
          mimeType: 'image/png',
          name: 'example-interlinker2.jpg',
          size: 1024 * 1024 * 2,
          url: '/static/mock-images/interlinkers/interlinker_1.png',
        },
      ].map((file) => (
          <Box
            key={file.url}
            sx={{
              m: 1,
              width: 240,
            }}
          >
            <InterlinkerFileCard
              mimeType={file.mimeType}
              name={file.name}
              size={file.size}
              url={file.url}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

InterlinkerOverview.propTypes = {
  interlinker: PropTypes.object.isRequired,
};

export default InterlinkerOverview;
