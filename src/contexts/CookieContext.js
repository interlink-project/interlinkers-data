import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import axiosInstance from 'axiosInstance';

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

const handlers = {
  INITIALIZE: (state) => ({
    ...state,
    isInitialized: true,
  }),
  SET_USER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      user,
      isAuthenticated: true
    };
  },
  LOGOUT: (state) => ({
    ...state,
    user: null,
    isAuthenticated: false
  }),
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
  ...initialState,
  platform: 'OIDC',
  logout: () => Promise.resolve(),
  signinRedirect: () => Promise.resolve(),
  getUser: () => Promise.resolve(),
});

export const AuthProvider = (props) => {
  const navigate = useNavigate();

  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    console.log("executing setUser")
    axiosInstance.get('/auth/api/v1/users/me').then(({ data }) => {
      console.log('RESPONSE FOR ME', data);
      dispatch({
        type: 'SET_USER',
        payload: {
          user: data,
        },
      });
    }).catch((e) => {
      console.error(e)
    }
    ).finally(() => dispatch({
      type: 'INITIALIZE',
    }));
  }, []);

  const signinRedirect = () => {
    window.location.replace(`/auth/login?redirect_on_callback=${window.location.pathname}`);
  }
  
  const logout = () => {
    window.location.replace(`/auth/logout`);
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        platform: 'Cookie',
        logout,
        signinRedirect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
