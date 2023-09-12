import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserAuthContext } from '../contexts/UserAuthProvider';
import isTokenValidMiddleware from './isTokenValidMiddleware';

const useAuthMiddleware = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(UserAuthContext);
  const isTokenValid = isTokenValidMiddleware();

  useEffect(() => {
    if (!isTokenValid && isLoggedIn) {
      navigate('/logout');
    }
  }, [navigate, isLoggedIn, isTokenValid]);
};

export default useAuthMiddleware;
