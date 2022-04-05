import {
  Avatar,
  Box,
  Container,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Typography
} from '@material-ui/core';
import { alpha, useTheme } from '@material-ui/core/styles';
import { AllInclusive, Build } from '@material-ui/icons';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import i18n from 'translations/i18n';


const getFeatures = (theme) => ([
  {
    icon: Build,
    image: `/static/graphics/schema-codesign.png`,
    items: [i18n.t('Engagement'),i18n.t('Design')],
    subheader: i18n.t('home-coproduction-build'),
    title: 'Co-design phase'
  },
  {
    icon: AllInclusive,
    items: [i18n.t('Build'),i18n.t('Sustain')],
    subheader: i18n.t('home-coproduction-codelivery'),
    image: `/static/graphics/schema-codelivery.png`,
    title: 'Co-delivery phase'
  },
]);
const HomeCoproduction = () => {
  const theme = useTheme();
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState();
  const {t} = useTranslation()
  const features = getFeatures(theme.palette.mode);

  useEffect(() => {
    (async () => {
      const responses = await Promise.all(features.map((feature) => fetch(feature.image)));
      const blobs = await Promise.all(responses.map((response) => response.blob()));

      setImages(() => {
        const map = new Map();

        blobs.forEach((blob, index) => {
          const url = features[index].image;
          const image = URL.createObjectURL(blob);

          map.set(url, image);
        });

        return map;
      });

      setIsLoading(false);
    })();
  }, [theme.palette.mode]);

  const handleSelectedFeatureIndexChange = (index) => {
    setSelectedFeatureIndex(index);
  };

  return (
    <>
      <Helmet>
        <title>Interlink</title>
      </Helmet>
      <Container sx={{ px: {xs: 2, lg: 20} , py: {xs: 2, lg: 10} }} maxWidth="lg">
        <Typography
          align='center'
          color='textPrimary'
          variant='h3'
          sx={{mb: 3}}
        >
          {t("Co-production process")}
        </Typography>

        <img style={{ width: "100%", height: "auto" }} src="/static/graphics/schema2.png" />
      </Container>

      <Box
        sx={{
          mt: 2,
          backgroundColor: 'background.default',
          pb: 15
        }}
      >
        <Container maxWidth='lg'>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <Typography
                color='textPrimary'
                variant='h5'
                sx={{mb: 4}}
              >
                {t("home-coproduction-1")}
                
              </Typography>
              
              {features.map((feature, index) => {
                const { icon: Icon, items, subheader, title } = feature;

                return (
                  <Box
                    key={title}
                    onClick={() => handleSelectedFeatureIndexChange(index)}
                    sx={{
                      backgroundColor: index
                        === selectedFeatureIndex
                        && alpha(theme.palette.primary.main, 0.08),
                      borderRadius: 1,
                      cursor: index === selectedFeatureIndex
                        ? 'default'
                        : 'pointer',
                      display: 'flex',
                      mb: 2,
                      p: 2
                    }}
                  >
                    <Avatar
                      sx={{
                        backgroundColor: index === selectedFeatureIndex
                          ? 'primary.main'
                          : 'transparent',
                        color: index === selectedFeatureIndex
                          ? 'primary.contrastText'
                          : 'text.secondary',
                        mr: 2
                      }}
                    >
                      <Icon fontSize='small' />
                    </Avatar>
                    <div>
                      <Typography
                        color='textPrimary'
                        variant='h6'
                      >
                        {title}
                      </Typography>
                      <Typography
                        color='textSecondary'
                        variant='body2'
                      >
                        {subheader}
                      </Typography>
                      {index === selectedFeatureIndex && (
                        <List
                          disablePadding
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: items.length > 4 && ({
                              sm: 'repeat(2, 1fr)'
                            }),
                            gap: 1,
                            pt: 2
                          }}
                        >
                          {items.map((item) => (
                            <ListItem
                              disableGutters
                              key={item}
                              sx={{ py: 0 }}
                            >
                              <ListItemAvatar
                                sx={{
                                  alignItems: 'center',
                                  display: 'flex',
                                  minWidth: 0,
                                  mr: 0.5
                                }}
                              >
                              </ListItemAvatar>
                              <ListItemText
                                primary={(
                                  <Typography
                                    color='textPrimary'
                                    variant='subtitle2'
                                  >
                                    {item}
                                  </Typography>
                                )}
                              />
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </div>
                  </Box>
                );
              })}
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <div>
                {isLoading
                  ? (
                    <Skeleton
                      sx={{
                        borderRadius: 1,
                        width: '100%',
                        pt: '79.25%'
                      }}
                      variant='rectangular'
                    />
                  )
                  : (
                    <img
                      alt={features[selectedFeatureIndex].title}
                      src={images.get(features[selectedFeatureIndex].image)}
                      style={{ maxWidth: '100%' }}
                    />
                  )}
              </div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default HomeCoproduction;
