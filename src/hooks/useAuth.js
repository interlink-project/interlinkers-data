import { useContext } from 'react';
import AuthContext from '../contexts/CookieContext';

const useAuth = () => useContext(AuthContext);

export default useAuth;
