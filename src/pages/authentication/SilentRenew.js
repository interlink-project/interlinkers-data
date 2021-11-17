import React, { useEffect } from 'react';
import useAuth from '../../hooks/useAuth';

const SilentRenew = () => {
  const auth = useAuth();
  useEffect(() => {
    auth.signinSilentCallback();
  }, []);

  return <span>loading</span>;
};

export default SilentRenew;
