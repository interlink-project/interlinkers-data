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
        {interlinker.files.map((file) => (
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
