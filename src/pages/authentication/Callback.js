import React, { useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    auth.signinRedirectCallback(() => navigate('/dashboard'));
  }, []);

  return <span>loading</span>;
};

export default Callback;
