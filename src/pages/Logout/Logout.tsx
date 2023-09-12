import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import usersApi from '../../API/usersApi';
import { UserAuthContext } from '../../contexts/UserAuthProvider';

function Logout() {
  const { setIsLoggedIn, setTokenData } = useContext(UserAuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpTimestamp');
    setIsLoggedIn(false);
    setTokenData(null);
    usersApi.removeToken();
  }, []);

  useEffect(() => {
    navigate('/profile', { replace: true });
  }, [navigate]);

  return <div>Logout</div>;
}

export default Logout;
