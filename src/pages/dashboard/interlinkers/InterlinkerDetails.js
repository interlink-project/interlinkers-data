import { useCallback, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { formatDistanceToNowStrict, subDays, subHours, subMinutes } from 'date-fns';
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { interlinkersApi } from '__fakeApi__';
import {
  InterlinkerActivities,
  InterlinkerApplicants,
  InterlinkerApplicationModal,
  InterlinkerAssets,
  InterlinkerOverview,
  InterlinkerReviews,
} from 'components/dashboard/interlinkers';
import useMounted from 'hooks/useMounted';
import useSettings from 'hooks/useSettings';
import ShareIcon from 'icons/Share';
import Markdown from 'react-markdown/with-html';
import { experimentalStyled } from '@material-ui/core/styles';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import dracula from 'react-syntax-highlighter/dist/cjs/styles/prism/dracula';

const now = new Date();


const MarkdownWrapper = experimentalStyled('div')(({ theme }) => ({
  color: theme.palette.text.primary,
  fontFamily: theme.typography.fontFamily,
  '& blockquote': {
    borderLeft: `4px solid ${theme.palette.text.secondary}`,
    marginBottom: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(1),
    '& > p': {
      color: theme.palette.text.secondary,
      marginBottom: 0
    }
  },
  '& code': {
    color: '#01ab56',
    fontFamily: 'Inconsolata, Monaco, Consolas, \'Courier New\', Courier, monospace',
    fontSize: 14,
    paddingLeft: 2,
    paddingRight: 2
  },
  '& h1': {
    fontSize: 35,
    fontWeight: 500,
    letterSpacing: '-0.24px',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(6)
  },
  '& h2': {
    fontSize: 29,
    fontWeight: 500,
    letterSpacing: '-0.24px',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(6)
  },
  '& h3': {
    fontSize: 24,
    fontWeight: 500,
    letterSpacing: '-0.06px',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(6)
  },
  '& h4': {
    fontSize: 20,
    fontWeight: 500,
    letterSpacing: '-0.06px',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(4)
  },
  '& h5': {
    fontSize: 16,
    fontWeight: 500,
    letterSpacing: '-0.05px',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2)
  },
  '& h6': {
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: '-0.05px',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2)
  },
  '& li': {
    fontSize: 14,
    lineHeight: 1.5,
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(4)
  },
  '& p': {
    fontSize: 14,
    lineHeight: 1.5,
    marginBottom: theme.spacing(2),
    '& > a': {
      color: theme.palette.secondary.main
    }
  }
}));

const renderers = {
  link: (props) => {
    const { href, children, ...other } = props;

    if (!href.startsWith('http')) {
      return (
        <a
          href={href}
          {...other}
        >
          {children}
        </a>
      );
    }

    return (
      <a
        href={href}
        rel='nofollow noreferrer noopener'
        target='_blank'
        {...other}
      >
        {children}
      </a>
    );
  },
  code: (props) => {
    const { language, value, ...other } = props;

    return (
      <SyntaxHighlighter
        language={language}
        style={dracula}
        {...other}
      >
        {value}
      </SyntaxHighlighter>
    );
  }
};


const tabs = [
  { label: 'Overview', value: 'overview' },
  { label: 'Documentation', value: 'documentation' },
  { label: 'Reviews', value: 'reviews' },
];

const InterlinkerDetails = ({ interlinker }) => {
  const [currentTab, setCurrentTab] = useState('overview');

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  if (!interlinker) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard: Interlinker Details</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Grid
            container
            justifyContent='center'
            alignItems='center'
            spacing={3}
          >
            <Avatar
              alt='Logotype'
              src={interlinker.logotype}
              variant='square'
            >
              {interlinker.name}
            </Avatar>
            <Box sx={{ ml: 2 }}>
              <Typography
                color='textPrimary'
                variant='h5'
              >
                {interlinker.name}
              </Typography>
            </Box>
            <Box>
              <Button
                color='primary'
                startIcon={<ShareIcon fontSize='small' />}
                sx={{ m: 1 }}
                variant='text'
              >
                Share
              </Button>
            </Box>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <Tabs
              indicatorColor='primary'
              onChange={handleTabsChange}
              scrollButtons='auto'
              textColor='primary'
              value={currentTab}
              centered
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.value}
                  label={tab.label}
                  value={tab.value}
                />
              ))}
            </Tabs>
          </Box>
          <Divider />
          <Box sx={{ mt: 3 }} >
            {currentTab === 'overview' && (
              <InterlinkerOverview interlinker={interlinker} />
            )}
            {currentTab === 'documentation' && (
              <MarkdownWrapper>
                <Markdown
                  escapeHtml
                  renderers={renderers}
                  source={interlinker.documentation}
                />
              </MarkdownWrapper>
            )}
            {currentTab === 'assets' && (
              <InterlinkerAssets interlinker={interlinker} />
            )}
            {currentTab === 'reviews' && (
              <InterlinkerReviews reviews={[
                {
                  id: '5f0366cd843161f193ebadd4',
                  author: {
                    avatar: '/static/mock-images/avatars/avatar-marcus_finn.png',
                    name: 'Marcus Finn',
                  },
                  comment: 'Great company, providing an awesome & easy to use product.',
                  createdAt: subHours(now, 2).getTime(),
                  value: 5,
                },
                {
                  id: 'to33twsyjphcfj55y3t07261',
                  author: {
                    avatar: '/static/mock-images/avatars/avatar-miron_vitold.png',
                    name: 'Miron Vitold',
                  },
                  comment:
                    "Not the best people managers, poor management skills, poor career development programs. Communication from corporate & leadership isn't always clear and is sometime one-sided. Low pay compared to FANG.",
                  createdAt: subHours(now, 2).getTime(),
                  value: 2,
                },
                {
                  id: '6z9dwxjzkqbmxuluxx2681jd',
                  author: {
                    avatar: '/static/mock-images/avatars/avatar-carson_darrin.png',
                    name: 'Carson Darrin',
                  },
                  comment:
                    'I have been working with this company full-time. Great for the work life balance. Cons, decentralized decision making process across the organization.',
                  createdAt: subHours(now, 2).getTime(),
                  value: 4,
                },
              ]} />
            )}

          </Box>
        </Container>
      </Box>

    </>
  );
};

export default InterlinkerDetails;
