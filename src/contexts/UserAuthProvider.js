import React, { createContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export const UserAuthContext = createContext({
  isLoggedIn: false,
  tokenData: null,
  setIsLoggedIn: () => {},
  setTokenData: () => {},
  isLoading: true,
});

function isTokenValid(token) {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return false;
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export const UserProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tokenData, setTokenData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token !== null && isTokenValid(token)) {
      setIsLoading(true);
      setIsLoggedIn(true);
      try {
        const decodedToken = jwtDecode(token);
        setTokenData(decodedToken);
      } catch (e) {
        setTokenData(null);
      }
    }
    setIsLoading(false);
  }, [isLoading]);

  return (
    <UserAuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, tokenData, setTokenData, isLoading }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};
