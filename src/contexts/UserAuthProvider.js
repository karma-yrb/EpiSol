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

  // Helper to normalize is_admin to boolean
  function normalizeTokenData(data) {
    if (!data) return data;
    return {
      ...data,
      is_admin: (data.is_admin === true || data.is_admin === 1 || data.is_admin === '1' || data.is_admin === 'true')
    };
  }

  useEffect(() => {
    let lastToken = localStorage.getItem('token');
    const checkToken = () => {
      const token = localStorage.getItem('token');
      if (token !== lastToken) {
        lastToken = token;
        if (token && isTokenValid(token)) {
          setIsLoggedIn(true);
          try {
            const decodedToken = jwtDecode(token);
            setTokenData(normalizeTokenData(decodedToken));
          } catch (e) {
            setTokenData(null);
          }
        } else {
          setIsLoggedIn(false);
          setTokenData(null);
        }
        setIsLoading(false);
      }
    };
    const interval = setInterval(checkToken, 500);
    // Appel initial
    checkToken();
    return () => clearInterval(interval);
  }, []);

  return (
    <UserAuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, tokenData, setTokenData, isLoading }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};
