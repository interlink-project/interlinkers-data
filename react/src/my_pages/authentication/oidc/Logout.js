import React, { useEffect } from 'react';
import useAuth from '../../../hooks/useAuth';

const Logout = () => {
  const auth = useAuth();
  useEffect(() => {
    auth.logout();
  }, []);

  return <span>loading</span>;
};

export default Logout;
