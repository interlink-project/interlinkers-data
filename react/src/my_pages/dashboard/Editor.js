import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Card, CircularProgress } from '@material-ui/core';
import useAuth from '../../hooks/useAuth';
import { useCookies } from 'react-cookie';
import axiosInstance from '../../axios';

const Editor = () => {
  const auth = useAuth();
  const { user } = auth;

  const [sessionID, setSessionID] = useState(true);
  const [auID, setAuthorID] = useState(true);
  const [grID, setGroupID] = useState(true);
  const name = (user.email).replace(/\s/g, '');
  const authorMapper = user.email;
  const groupMapper = "sdasdas";
  const padName = 'demopad';
  const apiKey = process.env.REACT_APP_API_KEY || "7965ea68087fa5f688d1f31b4a07a1bdd8b98a9c54004c1922ae167d61e8a449";
  const [cookies, setCookie] = useCookies(['sessionID']);

  useEffect(() => {
    axiosInstance
      .get(
        `http://localhost/etherpad/api/1/createAuthorIfNotExistsFor?apikey=${apiKey}&name=${name}&authorMapper=${authorMapper}`
      )
      .then((res) => {
        const {
          data: { authorID },
        } = res.data;
        console.log(name, authorMapper, authorID);
        setGroupID(authorID);

        axiosInstance
          .get(
            `http://localhost/etherpad/api/1/createGroupIfNotExistsFor?apikey=${apiKey}&groupMapper=${groupMapper}`
          )
          .then((res) => {
            const {
              data: { groupID },
            } = res.data;
            console.log(groupMapper, groupID);
            setGroupID(groupID);
            axiosInstance
              .get(
                `http://localhost/etherpad/api/1/createGroupPad?apikey=${apiKey}&groupID=${groupID}&padName=${padName}&text=This is the first sentence in the pad`
              )
              .then(() => {
                console.log('createGroupPad', groupID, padName );

                axiosInstance
                  .get(
                    `http://localhost/etherpad/api/1/createSession?apikey=${apiKey}&groupID=${groupID}&authorID=${authorID}&validUntil=2022201246`
                  )
                  .then((res) => {
                    const {
                      data: { sessionID },
                    } = res.data;
                    console.log(groupID, authorID, sessionID);
                    // setCookie('sessionID', sessionID, { path: '/' });
                    setSessionID(sessionID);
                  });
              });
          });
      });
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard: collaborative editor</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Card>
          {!sessionID ? (
            <CircularProgress />
          ) : (
            <iframe
              src={`http://localhost/etherpad/auth_session?sessionID=${sessionID}&groupID=${grID}&padName=${padName}`}
              width='100%'
              height='900'
              frameBorder='0'
            />
          )}
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default Editor;
