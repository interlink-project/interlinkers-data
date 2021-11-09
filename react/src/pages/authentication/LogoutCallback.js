import React, { useEffect } from 'react';
import useAuth from '../../hooks/useAuth';

const LogoutCallback = () => {
  const auth = useAuth();
  useEffect(() => {
    auth.signoutRedirectCallback();
  }, []);

  return <span>loading</span>;
};

export default LogoutCallback;
