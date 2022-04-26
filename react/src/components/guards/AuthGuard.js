import PropTypes from 'prop-types';
import useAuth from '../../hooks/useAuth';

const AuthGuard = (props) => {
  const { children } = props;
  const auth = useAuth();
  
  if (!auth.isAuthenticated) {
    auth.signinRedirect();
    return <span>loading</span>;
  }
  return <>{children}</>;
};

AuthGuard.propTypes = {
  children: PropTypes.node
};

export default AuthGuard;
