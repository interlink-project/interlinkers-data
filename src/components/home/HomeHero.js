import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Skeleton,
  Typography,
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

const HomeHero = (props) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `/static/home/hero_${theme.palette.mode}.png`
      );
      const blob = await response.blob();

      setImage(URL.createObjectURL(blob));
      setIsLoading(false);
    })();
  }, [theme.palette.mode]);

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        pt: 6,
        pb: 4
      }}
      {...props}
    >
      <Container
        maxWidth='md'
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          px: {
            md: '130px !important',
          },
          py: 5
        }}
      >
        {/*

        <Typography
          color="primary"
          variant="overline"
        >
          Introducing
        </Typography>
        <Typography
          align="center"
          color="textPrimary"
          variant="h3"
        >
          INTERLINK
        </Typography>
        */}

        <img
          alt='Logo'
          src='/static/graphics/logo-dark.png'
        />
        <Typography
          align='center'
          variant='h5'
          sx={{ my: 5 }}
        >
          The collaboration portal to co-produce better and more inclusive public services
        </Typography>
        <Button
          color='primary'
          component={RouterLink}
          size='large'
          to='/dashboard'
          variant='contained'
        >
          Go to dashboard
        </Button>
      </Container>
      {/* <Container
        maxWidth='lg'
        sx={{
          width: '100%',
          px: {
            md: 15,
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            pt: !isLoading && '52.13%',
          }}
        >
          {isLoading ? (
            <Skeleton
              sx={{
                borderRadius: 1,
                width: '100%',
                pt: '52.13%',
              }}
              variant='rectangular'
            />
          ) : null}
          
          <img
            alt='Shapes 1'
            src='/static/home/shapes_1.svg'
            style={{
              left: '3%',
              position: 'absolute',
              top: '-7.5%',
              width: '20%',
              maxWidth: '243.32px',
              zIndex: 0,
            }}
          />
          <img
            alt='Shapes 2'
            src='/static/home/shapes_2.svg'
            style={{
              bottom: 0,
              position: 'absolute',
              right: '-8%',
              width: '20%',
              maxWidth: '195.32px',
              zIndex: 30,
            }}
          />
        </Box>
      </Container>*/}
    </Box>
  );
};

export default HomeHero;
